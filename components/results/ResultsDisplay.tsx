
import React, { useState } from 'react';
import type { RecommendationResult, ClientInput, SellerInfo, ClientDetails } from '../../types';
import PlanAhorroCard from './PlanAhorroCard';
import PrendarioCard from './PrendarioCard';
import UvaCard from './UvaCard';
import Button from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import { useBranding } from '../../contexts/BrandingContext';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';
import Alert from '../common/Alert';

// Add type definition for jspdf and jspdf-autotable loaded from CDN
// This makes TypeScript aware of the `autoTable` function on the jsPDF instance.
interface jsPDFWithAutoTable {
  autoTable: (options: any) => jsPDFWithAutoTable;
  lastAutoTable: { finalY: number };
  // List other methods used in this component for type safety
  internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
  addImage: (...args: any[]) => jsPDFWithAutoTable;
  text: (...args: any[]) => jsPDFWithAutoTable;
  setFont: (...args: any[]) => jsPDFWithAutoTable;
  setFontSize: (size: number) => jsPDFWithAutoTable;
  setTextColor: (...args: any[]) => jsPDFWithAutoTable;
  setDrawColor: (...args: any[]) => jsPDFWithAutoTable;
  setLineWidth: (width: number) => jsPDFWithAutoTable;
  line: (...args: any[]) => jsPDFWithAutoTable;
  setFillColor: (...args: any[]) => jsPDFWithAutoTable;
  roundedRect: (...args: any[]) => jsPDFWithAutoTable;
  save: (filename: string) => void;
  getImageProperties: (imageData: any) => any;
  addPage: () => jsPDFWithAutoTable;
  output: (type: 'blob') => Blob;
}

declare global {
  interface Window {
    jspdf: {
      jsPDF: new (options: any) => jsPDFWithAutoTable;
    };
  }
  // FIX: Corrected the signature for `navigator.canShare` to use optional property syntax. This avoids an "Overload signatures must all be optional or required" error that occurs when a required method from the base DOM library conflicts with an optional method in this augmentation.
  interface Navigator {
    canShare?: (data?: { files?: File[]; text?: string; title?: string; url?: string }) => boolean;
  }
}

interface ResultsDisplayProps {
  results: RecommendationResult;
  clientInput: ClientInput;
  sellerInfo?: SellerInfo;
  clientDetails?: ClientDetails;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, clientInput, sellerInfo, clientDetails }) => {
  const { mejorPlan, planSolicitado, alternativasPrendario, alternativasUVA } = results;
  const { logo } = useBranding();
  const [isSharing, setIsSharing] = useState(false);
  const [shareNotification, setShareNotification] = useState('');

  const showPlanSolicitado = planSolicitado && (!mejorPlan || mejorPlan.plan.id !== planSolicitado.plan.id);
  const showMejorPlanAlternativo = mejorPlan && planSolicitado && mejorPlan.plan.id !== planSolicitado.plan.id;


  const generatePDFDoc = (): jsPDFWithAutoTable | null => {
    const budgetToPrint = planSolicitado;
    if (!budgetToPrint) return null;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    // --- Document Constants ---
    const PAGE_WIDTH = doc.internal.pageSize.getWidth();
    const MARGIN = 40;
    const contentWidth = PAGE_WIDTH - MARGIN * 2;
    const RENAULT_YELLOW = '#FFD100';
    const RENAULT_DARK = '#222222';
    const TEXT_NORMAL = '#333333';
    const TEXT_LIGHT = '#666666';
    const BG_LIGHT_GRAY = '#F7F7F7';
    let yPos = 40;

    // --- Helper Functions ---
    const drawSectionTitle = (title: string) => {
      yPos += 15;
      doc.setFont('helvetica', 'bold').setFontSize(14).setTextColor(RENAULT_DARK);
      doc.text(title, MARGIN, yPos);
      yPos += 8;
      doc.setDrawColor(RENAULT_YELLOW).setLineWidth(2).line(MARGIN, yPos, MARGIN + 50, yPos);
      yPos += 25;
    };
    
    const checkPageBreak = (neededHeight: number) => {
        if (yPos + neededHeight > doc.internal.pageSize.getHeight() - MARGIN) {
            doc.addPage();
            yPos = MARGIN;
        }
    };


    // --- 1. HEADER ---
    if (logo) {
      try {
        const imgProps = doc.getImageProperties(logo);
        const aspectRatio = imgProps.width / imgProps.height;
        let imgWidth = 80;
        let imgHeight = imgWidth / aspectRatio;
        if (imgHeight > 40) { imgHeight = 40; imgWidth = imgHeight * aspectRatio; }
        doc.addImage(logo, MARGIN, yPos, imgWidth, imgHeight);
      } catch (e) {
        console.error("Error adding logo:", e);
        doc.setFontSize(16).setFont('helvetica', 'bold').text("Presupuesto Oficial", MARGIN, yPos + 15);
      }
    } else {
      doc.setFontSize(16).setFont('helvetica', 'bold').text("Presupuesto Oficial", MARGIN, yPos + 15);
    }
    yPos = 100;
    doc.setDrawColor(230, 230, 230).line(MARGIN, yPos, PAGE_WIDTH - MARGIN, yPos);
    yPos += 30;

    // --- 2. MAIN TITLE & DATE ---
    doc.setFont('helvetica', 'bold').setFontSize(22).setTextColor(RENAULT_DARK);
    doc.text('Presupuesto Personalizado', PAGE_WIDTH / 2, yPos, { align: 'center' });
    yPos += 18;
    const generationDate = new Date().toLocaleString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(TEXT_LIGHT);
    doc.text(`Generado el ${generationDate}`, PAGE_WIDTH / 2, yPos, { align: 'center' });
    yPos += 40;
    
    // --- 3. CLIENT & SELLER INFO in columns ---
    const infoStartY = yPos;
    let leftY = infoStartY;
    let rightY = infoStartY;
    
    if (clientDetails && clientDetails.name) {
        doc.setFont('helvetica', 'bold').setFontSize(10).setTextColor(TEXT_LIGHT);
        doc.text('PRESUPUESTO PARA:', MARGIN, leftY);
        leftY += 15;
        doc.setFont('helvetica', 'normal').setFontSize(11).setTextColor(TEXT_NORMAL);
        doc.text(clientDetails.name, MARGIN, leftY);
        if (clientDetails.email) {
            leftY += 15;
            doc.text(clientDetails.email, MARGIN, leftY);
        }
        if (clientDetails.phone) {
            leftY += 15;
            doc.text(clientDetails.phone, MARGIN, leftY);
        }
    }
    
    if (sellerInfo && sellerInfo.name) {
        const sellerX = PAGE_WIDTH - MARGIN;
        doc.setFont('helvetica', 'bold').setFontSize(10).setTextColor(TEXT_LIGHT);
        doc.text('ASESOR COMERCIAL:', sellerX, rightY, { align: 'right' });
        rightY += 15;
        doc.setFont('helvetica', 'normal').setFontSize(11).setTextColor(TEXT_NORMAL);
        doc.text(sellerInfo.name, sellerX, rightY, { align: 'right' });
        if (sellerInfo.email) {
            rightY += 15;
            doc.text(sellerInfo.email, sellerX, rightY, { align: 'right' });
        }
        if (sellerInfo.phone) {
            rightY += 15;
            doc.text(sellerInfo.phone, sellerX, rightY, { align: 'right' });
        }
    }
    
    yPos = Math.max(leftY, rightY) + 40; // Set yPos for the next section

    // --- 4. VEHICLE IMAGE ---
    if (budgetToPrint.plan.imageUrl) {
      try {
        const imgProps = doc.getImageProperties(budgetToPrint.plan.imageUrl);
        const aspectRatio = imgProps.width / imgProps.height;
        let imgWidth = contentWidth * 0.7;
        let imgHeight = imgWidth / aspectRatio;
        const imgX = (PAGE_WIDTH - imgWidth) / 2;
        checkPageBreak(imgHeight + 20);
        doc.addImage(budgetToPrint.plan.imageUrl, 'JPEG', imgX, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 20;
      } catch (e) { console.error("Error adding vehicle image:", e); }
    }

    // --- 5. VEHICLE BANNER ---
    doc.setFillColor(RENAULT_DARK).roundedRect(MARGIN, yPos, contentWidth, 40, 5, 5, 'F');
    doc.setFont('helvetica', 'bold').setFontSize(16).setTextColor('#FFFFFF');
    doc.text(budgetToPrint.plan.modelo, PAGE_WIDTH / 2, yPos + 26, { align: 'center' });
    yPos += 70;

    // --- 6. INFORMATION CARDS ---
    const cardWidth = (contentWidth / 2) - 10;
    const drawInfoCard = (title: string, details: {label: string; value: string}[], x: number, startY: number) => {
      let cardY = startY;
      doc.setFont('helvetica', 'bold').setFontSize(10).setTextColor(TEXT_LIGHT);
      doc.text(title.toUpperCase(), x, cardY);
      cardY += 8;
      doc.setDrawColor(230, 230, 230).line(x, cardY, x + cardWidth, cardY);
      cardY += 25;
      details.forEach(detail => {
        doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(TEXT_NORMAL);
        doc.text(detail.label, x, cardY);
        doc.setFont('helvetica', 'bold').setFontSize(11);
        doc.text(detail.value, x + cardWidth, cardY, { align: 'right' });
        cardY += 25;
      });
      return cardY;
    };
    
    checkPageBreak(120);
    const card1Details = [
      { label: 'Capital Aportado:', value: formatCurrency(clientInput.capitalCliente) },
      { label: 'Cuotas Cubiertas:', value: String(budgetToPrint.cuotasCubiertas) },
    ];
    const card1YEnd = drawInfoCard('Su Inversión', card1Details, MARGIN, yPos);
    
    const card2Details = [
      { label: 'Precio de Lista:', value: formatCurrency(budgetToPrint.plan.precioLista) },
      { label: 'Total de Cuotas:', value: `${budgetToPrint.plan.cuotasTotales} meses` },
      { label: 'Cuotas Restantes:', value: String(budgetToPrint.cuotasRestantes) },
    ];
    const card2YEnd = drawInfoCard('Resumen de la Financiación', card2Details, MARGIN + cardWidth + 20, yPos);
    yPos = Math.max(card1YEnd, card2YEnd) + 20;

    // --- 7. HIGHLIGHTED MONTHLY PAYMENT ---
    checkPageBreak(80);
    doc.setFillColor(BG_LIGHT_GRAY).roundedRect(MARGIN, yPos, contentWidth, 80, 5, 5, 'F');
    doc.setFont('helvetica', 'normal').setFontSize(12).setTextColor(TEXT_NORMAL);
    doc.text('CUOTA MENSUAL ESTIMADA', PAGE_WIDTH / 2, yPos + 30, { align: 'center' });
    doc.setFont('helvetica', 'bold').setFontSize(28).setTextColor(RENAULT_DARK);
    doc.text(formatCurrency(budgetToPrint.cuotaEstimada), PAGE_WIDTH / 2, yPos + 65, { align: 'center' });
    yPos += 110;

    // --- 8. BEST ALTERNATIVE PLAN ---
    if (showMejorPlanAlternativo && mejorPlan) {
        checkPageBreak(150);
        drawSectionTitle("Te recomendamos esta financiación");
        doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(TEXT_NORMAL);
        doc.text(`Basado en tu cuota objetivo de ${formatCurrency(clientInput.cuotaObjetivo)}, el siguiente modelo se ajusta mejor.`, MARGIN, yPos);
        yPos += 12;
        doc.text(`Puedes optar por un "Cambio de Modelo" al momento de la adjudicación.`, MARGIN, yPos);
        yPos += 25;
        
        doc.setFillColor(BG_LIGHT_GRAY).roundedRect(MARGIN, yPos, contentWidth, 60, 5, 5, 'F');
        doc.setFont('helvetica', 'bold').setFontSize(14).setTextColor(RENAULT_DARK);
        doc.text(mejorPlan.plan.modelo, MARGIN + 15, yPos + 25);
        
        doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(TEXT_NORMAL);
        doc.text('Cuota Estimada:', MARGIN + 15, yPos + 45);
        doc.setFont('helvetica', 'bold').setFontSize(14).setTextColor(RENAULT_DARK);
        doc.text(formatCurrency(mejorPlan.cuotaEstimada), MARGIN + 90, yPos + 45);
        yPos += 80;
    }

    // --- 9. FINANCING ALTERNATIVES ---
    const hasPrendario = alternativasPrendario.length > 0;
    const hasUVA = alternativasUVA && alternativasUVA.escenarios.length > 0;

    if (hasPrendario || hasUVA) {
        checkPageBreak(250);
        drawSectionTitle("Otras Formas de Llegar a tu 0km");
        const capitalFinanciado = formatCurrency(alternativasPrendario[0]?.capitalPrestamo || alternativasUVA?.capitalPrestamo);
        doc.setFont('helvetica', 'normal').setFontSize(10).setTextColor(TEXT_NORMAL);
        doc.text(`Calculado sobre un capital a financiar de ${capitalFinanciado} (Precio de lista - Su capital).`, MARGIN, yPos);
        yPos += 25;
        
        // --- Prendario Table ---
        if (hasPrendario) {
          doc.setFont('helvetica', 'bold').setFontSize(11).setTextColor(TEXT_NORMAL);
          doc.text('Préstamo Prendario', MARGIN, yPos);
          doc.autoTable({
              startY: yPos + 10,
              head: [['Plazo', 'Cuota Mensual Fija']],
              body: alternativasPrendario.map(p => [ `${p.plazo} meses`, formatCurrency(p.cuota) ]),
              theme: 'grid',
              margin: { left: MARGIN, right: MARGIN },
              styles: {
                  font: 'helvetica',
                  headStyles: { fillColor: RENAULT_DARK, textColor: '#FFFFFF' },
                  cellPadding: 6,
              }
          });
          yPos = doc.lastAutoTable.finalY + 25;
        }

        // --- UVA Table ---
        if (hasUVA) {
            checkPageBreak(150);
            doc.setFont('helvetica', 'bold').setFontSize(11).setTextColor(TEXT_NORMAL);
            doc.text(`Crédito UVA (${alternativasUVA.plazo} meses)`, MARGIN, yPos);
             doc.autoTable({
                startY: yPos + 10,
                head: [['Escenario', 'Cuota Inicial Estimada']],
                body: alternativasUVA.escenarios.map(e => [ e.tipo, formatCurrency(e.cuotaInicial) ]),
                theme: 'grid',
                margin: { left: MARGIN, right: MARGIN },
                styles: {
                    font: 'helvetica',
                    headStyles: { fillColor: RENAULT_DARK, textColor: '#FFFFFF' },
                    cellPadding: 6,
                }
            });
            yPos = doc.lastAutoTable.finalY + 20;
        }
    }

    // --- 10. FOOTER ---
    const footerY = doc.internal.pageSize.getHeight() - 50;
    doc.setDrawColor(230, 230, 230).line(MARGIN, footerY, PAGE_WIDTH - MARGIN, footerY);
    doc.setFont('helvetica', 'normal').setFontSize(8).setTextColor(TEXT_LIGHT);
    const disclaimer = "Valores estimados. Sujetos a validación comercial y a variaciones de precio/índices.";
    doc.text(disclaimer, PAGE_WIDTH / 2, footerY + 20, { align: 'center' });
    doc.text(`© ${new Date().getFullYear()} Renault Plan Rombo.`, PAGE_WIDTH / 2, footerY + 35, { align: 'center' });

    return doc;
  };

  const handleDownloadPDF = () => {
    const doc = generatePDFDoc();
    if (doc && planSolicitado) {
      doc.save(`presupuesto-renault-${planSolicitado.plan.modelo.replace(/\s/g, '_')}.pdf`);
    }
  };
  
  const handleShareWhatsApp = async () => {
    if (!planSolicitado) return;
    setIsSharing(true);
    setShareNotification('');

    const doc = generatePDFDoc();
    if (!doc) {
        setIsSharing(false);
        return;
    }
    
    const fileName = `presupuesto-renault-${planSolicitado.plan.modelo.replace(/\s/g, '_')}.pdf`;

    // The Web Share API needs a file object.
    const pdfBlob = doc.output('blob');
    const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });
    const shareData = {
      files: [pdfFile],
      title: `Presupuesto Renault ${planSolicitado.plan.modelo}`,
      text: `Hola, te comparto el presupuesto para el Renault ${planSolicitado.plan.modelo}.`,
    };

    // Try native sharing first (best for mobile and compatible desktops)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if ((error as DOMException).name !== 'AbortError') {
          console.error('Share failed:', error);
        }
      } finally {
        setIsSharing(false);
      }
    } else {
      // Fallback for desktop: download and prompt user to attach it to WhatsApp Web/Desktop.
      
      // 1. Trigger PDF download
      doc.save(fileName);

      // 2. Open WhatsApp with a pre-filled message
      const whatsappMessage = encodeURIComponent(
        `Hola, te envío el presupuesto para el Renault ${planSolicitado.plan.modelo}.`
      );
      window.open(`https://wa.me/?text=${whatsappMessage}`, '_blank');

      // 3. Display an on-screen notification to guide the user
      setShareNotification('PDF descargado. Búscalo en tu carpeta de descargas y adjúntalo a tu chat de WhatsApp.');
      setTimeout(() => setShareNotification(''), 7000); // Hide after 7 seconds

      setIsSharing(false);
    }
  };


  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-2">Tu Presupuesto Personalizado</h2>
      <div className="text-center mb-6">
        <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={handleDownloadPDF} variant="secondary">
              Descargar PDF
            </Button>
            <Button onClick={handleShareWhatsApp} disabled={isSharing} icon={<WhatsAppIcon className="h-5 w-5" />}>
              {isSharing ? 'Generando...' : 'Compartir'}
            </Button>
        </div>
        {shareNotification && (
            <div className="mt-4 max-w-2xl mx-auto">
                <Alert message={shareNotification} type="info" />
            </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {mejorPlan && (
          <PlanAhorroCard
            presupuesto={mejorPlan}
            title="Mejor Opción: Financiación Directo de Fábrica"
            isFeatured
          />
        )}

        {showPlanSolicitado && (
          <PlanAhorroCard
            presupuesto={planSolicitado}
            title={`Financiación para ${planSolicitado.plan.modelo}`}
          />
        )}
        
        {alternativasPrendario.length > 0 && (
          <PrendarioCard resultados={alternativasPrendario} />
        )}

        {alternativasUVA && (
          <UvaCard resultado={alternativasUVA} />
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
