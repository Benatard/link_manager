"use client"

import { useState, useEffect } from "react"

interface Link {
  id: string
  title: string
  url: string
  category: string
  image?: string
  description?: string
  createdAt: string
}

const DEFAULT_CATEGORIES = [
  "Réseaux Sociaux",
  "Outils de Travail",
  "Divertissement",
  "Éducation",
  "Shopping",
  "Actualités",
  "Développement",
  "Design",
  "Autre",
]

export default function LinkManager() {
  const [links, setLinks] = useState<Link[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newLink, setNewLink] = useState({
    title: "",
    url: "",
    category: "",
    image: "",
    description: "",
  })

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/links")
      if (response.ok) {
        const data = await response.json()
        setLinks(data)
      } else {
        console.error("Erreur lors du chargement des liens")
      }
    } catch (error) {
      console.error("Erreur lors du chargement des liens:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addLink = async () => {
    if (newLink.title && newLink.url && newLink.category) {
      try {
        setIsSubmitting(true)
        const linkData = {
          title: newLink.title,
          url: newLink.url.startsWith("http") ? newLink.url : `https://${newLink.url}`,
          category: newLink.category,
          image: newLink.image || null,
          description: newLink.description || null,
        }

        const response = await fetch("/api/links", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(linkData),
        })

        if (response.ok) {
          const newLinkData = await response.json()
          setLinks([newLinkData, ...links])
          setNewLink({ title: "", url: "", category: "", image: "", description: "" })
          setIsModalOpen(false)
        } else {
          console.error("Erreur lors de l'ajout du lien")
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout du lien:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const deleteLink = async (id: string) => {
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setLinks(links.filter((link) => link.id !== id))
      } else {
        console.error("Erreur lors de la suppression du lien")
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du lien:", error)
    }
  }

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.url.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || link.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(links.map((link) => link.category))]
  const linksByCategory = categories.reduce(
    (acc, category) => {
      acc[category] = links.filter((link) => link.category === category)
      return acc
    },
    {} as Record<string, Link[]>,
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div role="status ">
            <svg
              aria-hidden="true"
              className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="text-gray-200 ml-5">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className=" border-gray-200 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl text-green-700 border mb-1 border-green-700 p-1 rounded-lg font-bold text-gray-200">LinkManager</h1>
              </div>
            </div>

            
          </div>
        </div>
      </header>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-200">Ajouter un nouveau lien</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-200 hover:text-gray-200">
                <svg className="h-6 w-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-300 mb-6">Ajoutez un lien à votre collection organisée par catégories.</p>

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-1">
                  Titre
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Nom de la plateforme"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  className="w-full text-gray-200 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-200 mb-1">
                  URL
                </label>
                <input
                  id="url"
                  type="text"
                  placeholder="https://example.com"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  className="w-full text-gray-200 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-200 mb-1">
                  Catégorie
                </label>
                <select
                  id="category"
                  value={newLink.category}
                  onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
                  className="w-full text-gray-200 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option className="bg-gray-900" value="">Choisir une catégorie</option>
                  {DEFAULT_CATEGORIES.map((category) => (
                    <option className="bg-gray-900" key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-200 mb-1">
                  Image <span className="text-gray-400 text-xs">(optionnel)</span>
                </label>
                <input
                  id="image"
                  type="text"
                  placeholder="URL de l'image ou favicon"
                  value={newLink.image}
                  onChange={(e) => setNewLink({ ...newLink, image: e.target.value })}
                  className="w-full text-gray-200 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-200 mb-1">
                  Description <span className="text-gray-400 text-xs">(optionnel)</span>
                </label>
                <textarea
                  id="description"
                  placeholder="Courte description de la plateforme"
                  value={newLink.description}
                  onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                  rows={3}
                  className="w-full text-gray-200 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                />
              </div>

              <button
                onClick={addLink}
                disabled={isSubmitting}
                className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                   <div role="status ">
            <svg
              aria-hidden="true"
              className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="text-gray-200 ml-5">Add...</span>
          </div>
                  </>
                ) : (
                  "Ajouter le lien"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Rechercher dans vos liens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-gray-200 pl-10 pr-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full text-gray-400 sm:w-48 px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option className="bg-gray-700 text-gray-200" value="all">Toutes les catégories</option>
            {categories.map((category) => (
              <option className="bg-gray-700 text-gray-200 " key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="container -mt-5 px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green-900 cursor-pointer hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add link
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{links.length}</p>
                
              </div>
              <div>
                <p className="text-sm text-gray-300">Total des liens</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>

              </div>
              <div>
                <p className="text-sm text-gray-300">Catégories</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                                <p className="text-2xl font-bold text-gray-900">{filteredLinks.length}</p>

              </div>
              <div>
                <p className="text-sm text-gray-200">Résultats</p>
              </div>
            </div>
          </div>
        </div>

        {/* Links Display */}
        {selectedCategory === "all" ? (
          <div className="space-y-8">
            {Object.entries(linksByCategory).map(([category, categoryLinks]) => (
              <div key={category}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-semibold text-gray-200">{category}</h2>
                  <span className="bg-gray-800 text-gray-100 px-2 py-1 rounded-lg text-sm">
                    {categoryLinks.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryLinks
                    .filter(
                      (link) =>
                        link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        link.url.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map((link) => (
                      <div
                        key={link.id}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        {link.image && (
                          <div className="mb-3">
                            <img
                              src={link.image || "/placeholder.svg"}
                              alt={link.title}
                              className="w-12 h-12 rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none"
                              }}
                            />
                          </div>
                        )}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-green-500 mb-1">{link.title}</h3>
                            {link.description && <p className="text-sm text-gray-200 mb-2">{link.description}</p>}
                            <p className="text-sm text-gray-400 break-all">{link.url}</p>
                          </div>
                          {/* <button onClick={() => deleteLink(link.id)} className="text-red-500 hover:text-red-700 p-1">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button> */}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="bg-gray-700 border-gray-600 border text-gray-300 px-2 py-1 rounded text-xs">
                            {link.category}
                          </span>
                          <button
                            onClick={() => window.open(link.url, "_blank")}
                            className="text-emerald-600 hover:text-emerald-700 cursor-pointer p-1"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLinks.map((link) => (
              <div
                key={link.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {link.image && (
                  <div className="mb-3">
                    <img
                      src={link.image || "/placeholder.svg"}
                      alt={link.title}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{link.title}</h3>
                    {link.description && <p className="text-sm text-gray-600 mb-2">{link.description}</p>}
                    <p className="text-sm text-gray-500 break-all">{link.url}</p>
                  </div>
                  {/* <button onClick={() => deleteLink(link.id)} className="text-red-500 hover:text-red-700 p-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button> */}
                </div>
                <div className="flex items-center justify-between">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">{link.category}</span>
                  <button
                    onClick={() => window.open(link.url, "_blank")}
                    className="text-emerald-600 hover:text-emerald-700 p-1"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredLinks.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-lg inline-block mb-4">
              <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun lien trouvé</h3>
            <p className="text-gray-200 mb-4">
              {searchTerm || selectedCategory !== "all"
                ? "Essayez de modifier vos critères de recherche."
                : "Commencez par ajouter votre premier lien !"}
            </p>
            {!searchTerm && selectedCategory === "all" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter votre premier lien
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
