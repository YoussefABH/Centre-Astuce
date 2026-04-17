rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Fonction utilitaire : vérifier que l'utilisateur est connecté
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Fonction : vérifier que l'utilisateur accède à son propre centre
    function isOwnCentre(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Racine centres : l'utilisateur ne peut accéder qu'à son propre dossier
    match /centres/{userId} {
      allow read, write: if isOwnCentre(userId);
      
      // Toutes les sous-collections des années
      match /years/{yearId} {
        allow read, write: if isOwnCentre(userId);
        
        // Sous-collections de l'année : élèves, parents, paiements, profs, dépenses, schedule
        match /eleves/{docId} {
          allow read, write: if isOwnCentre(userId);
        }
        match /parents/{docId} {
          allow read, write: if isOwnCentre(userId);
        }
        match /paiements/{docId} {
          allow read, write: if isOwnCentre(userId);
        }
        match /profs/{docId} {
          allow read, write: if isOwnCentre(userId);
          // Sous-collection sessions pour chaque professeur
          match /sessions/{sessionId} {
            allow read, write: if isOwnCentre(userId);
          }
        }
        match /depenses/{docId} {
          allow read, write: if isOwnCentre(userId);
        }
        match /schedule/{docId} {
          allow read, write: if isOwnCentre(userId);
        }
      }
      
      // Collections globales du centre (non liées à une année spécifique)
      match /reservations/{reservationId} {
        allow read, write: if isOwnCentre(userId);
      }
      match /invoices/{invoiceId} {
        allow read, write: if isOwnCentre(userId);
      }
    }
    
    // Aucun accès à d'autres collections
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
