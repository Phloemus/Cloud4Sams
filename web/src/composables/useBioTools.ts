// Liens (et infos) bio.tools pour un outil. Réactif : la carte se met à jour
// toute seule quand la réponse arrive (useFetch renvoie des refs).

export interface BioToolInfo {
  name: string
  description: string
  repo: string | null
  doc: string | null
  doi: string | null
}

const doiUrl = (doi: string) => (/^https?:/i.test(doi) ? doi : `https://doi.org/${doi}`)

export const useBioTool = (biotoolsId: string) => {
  const { data, status } = useFetch<BioToolInfo | null>(
    `/api/biotools/${encodeURIComponent(biotoolsId)}`,
    { lazy: true, key: `biotools:${biotoolsId}` },
  )

  const info = computed(() => data.value ?? null)

  const links = computed(() => ({
    // Toujours disponible : construit à partir de l'ID, sans attendre la réponse
    biotools: `https://bio.tools/${encodeURIComponent(biotoolsId)}`,
    repo: data.value?.repo ?? null,
    doc: data.value?.doc ?? null,
    publication: data.value?.doi ? doiUrl(data.value.doi) : null,
  }))

  return { info, links, pending: computed(() => status.value === 'pending') }
}