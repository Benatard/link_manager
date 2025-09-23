import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(links)
  } catch (error) {
    console.error("Erreur lors de la récupération des liens:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, url, category, image, description } = body;

    if (!title || !url || !category) {
      return NextResponse.json(
        { error: "Titre, URL et catégorie sont requis" },
        { status: 400 }
      );
    }

    const link = await prisma.link.create({
      data: {
        title,
        url,
        category,
        image: image || null,
        description: description || null,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du lien:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}

