<template>
  <div class="p-8 text-center mt-10 border-2 border-dashed border-gray-300 rounded-lg mx-4">
    <h1 class="text-2xl text-red-500 font-bold mb-4">🚧 Page en travaux</h1>
    <p class="text-gray-700 mb-2">Le contenu de cette page est en cours de création.</p>
    <p class="text-sm text-gray-500 mb-6">
<!--       (Message d'attente affiché pour éviter un crash Nuxt pendant le développement)
 -->    </p>

    <!-- Petit bouton pour revenir à l'accueil en attendant -->
    <NuxtLink 
      to="/" 
      class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded transition"
    >
      Retour au catalogue
    </NuxtLink>
  </div>
</template>