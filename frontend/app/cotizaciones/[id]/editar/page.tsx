"use client"
import { QuotationWizard } from "@/components/cotizaciones/QuotationWizard"
import { useParams } from "next/navigation"

export default function EditQuotationPage() {
  const params = useParams();
  // Convertimos el ID de string a número de forma segura
  const id = params.id ? parseInt(params.id as string) : undefined;

  if (!id || isNaN(id)) {
      return <div>Error: ID de cotización inválido</div>;
  }

  // Renderizamos el mismo Wizard, pero le pasamos el ID para que active el "modo edición"
  return <QuotationWizard cotizacionId={id} />
}