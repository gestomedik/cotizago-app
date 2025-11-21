import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Exporta un elemento HTML a PDF
 * @param elementId - ID del elemento HTML a exportar
 * @param filename - Nombre del archivo PDF (sin extensión)
 * @param options - Opciones adicionales
 */
export const exportToPDF = async (
    elementId: string,
    filename: string,
    options: {
        scale?: number
        orientation?: 'portrait' | 'landscape'
        format?: 'a4' | 'letter'
    } = {}
) => {
    const {
        scale = 1.5, // Reducido para evitar problemas
        orientation = 'portrait',
        format = 'a4'
    } = options

    try {
        const element = document.getElementById(elementId)
        if (!element) {
            console.error(`Elemento con ID "${elementId}" no encontrado`)
            alert('No se pudo encontrar el contenido para exportar')
            return false
        }

        console.log('Generando PDF...')

        // Capturar el elemento como imagen con configuración simplificada
        const canvas = await html2canvas(element, {
            scale,
            useCORS: false, // Cambiado a false para evitar problemas con imágenes
            logging: true, // Activado para debug
            backgroundColor: '#ffffff',
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight
        })

        console.log('Canvas generado:', canvas.width, 'x', canvas.height)

        // Verificar que el canvas sea válido
        if (!canvas || canvas.width === 0 || canvas.height === 0) {
            console.error('Canvas inválido')
            alert('Error al generar la imagen del PDF')
            return false
        }

        // Convertir a imagen
        const imgData = canvas.toDataURL('image/jpeg', 0.95) // Cambio a JPEG para mayor compatibilidad

        console.log('Imagen generada, creando PDF...')

        // Crear PDF
        const pdf = new jsPDF({
            orientation,
            unit: 'mm',
            format,
            compress: true
        })

        const pageWidth = orientation === 'portrait' ? 210 : 297 // A4 in mm
        const pageHeight = orientation === 'portrait' ? 297 : 210

        const imgWidth = pageWidth - 20 // Márgenes de 10mm a cada lado
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        let yPosition = 10 // Margen superior
        let heightLeft = imgHeight

        // Agregar la primera página
        pdf.addImage(imgData, 'JPEG', 10, yPosition, imgWidth, imgHeight)
        heightLeft -= (pageHeight - 20) // Restar altura de página menos márgenes

        // Si el contenido es más grande que una página, agregar páginas adicionales
        while (heightLeft > 0) {
            yPosition = -(pageHeight - 20 - heightLeft) + 10
            pdf.addPage()
            pdf.addImage(imgData, 'JPEG', 10, yPosition, imgWidth, imgHeight)
            heightLeft -= (pageHeight - 20)
        }

        // Guardar el PDF
        pdf.save(`${filename}.pdf`)

        console.log('PDF guardado exitosamente')
        alert('PDF exportado correctamente')

        return true
    } catch (error) {
        console.error('Error al exportar PDF:', error)
        alert('Error al generar el PDF. Por favor, inténtalo de nuevo.')
        return false
    }
}

/**
 * Genera el nombre de archivo para una cotización
 */
export const generateQuotationPDFFilename = (
    clientName: string,
    destination: string
) => {
    const fecha = new Date().toISOString().split('T')[0]
    const clientSlug = clientName.replace(/\s+/g, '-').toLowerCase()
    const destSlug = destination.replace(/\s+/g, '-').toLowerCase()
    return `Cotizacion-${clientSlug}-${destSlug}-${fecha}`
}
