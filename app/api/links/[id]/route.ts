import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await prisma.link.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Lien supprimé avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression du lien:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
