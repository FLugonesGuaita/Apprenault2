import PocketBase from 'pocketbase';

// Se crea y exporta una única instancia del cliente de PocketBase.
// Por defecto, apunta a la dirección local donde PocketBase se ejecuta.
// Si despliegas tu backend de PocketBase en un servidor, deberás cambiar esta URL.
export const pb = new PocketBase('http://127.0.0.1:8090');

// Para mejorar la experiencia de desarrollo, refresca el token automáticamente si es necesario.
pb.autoRefreshThreshold = 30 * 60; // 30 minutos
