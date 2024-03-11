// js/script.js

document.addEventListener('DOMContentLoaded', function() {
    // Sélectionnez le bouton de suppression
    const deleteButton = document.getElementById('deleteButton');

    // Ajoutez un écouteur d'événements sur le bouton
    deleteButton.addEventListener('click', function() {
        // Affichez une boîte de dialogue de confirmation
        const isConfirmed = confirm('Êtes-vous sûr de vouloir supprimer cet article ?');

        // Si l'utilisateur confirme, effectuez l'action de suppression
        if (isConfirmed) {
            // Ajoutez ici la logique pour supprimer l'article
            console.log('Article supprimé !');
        } else {
            console.log('Suppression annulée.');
        }
    });
});