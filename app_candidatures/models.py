from django.db import models
class Candidature(models.Model):
    dateSoumission = models.DateTimeField(auto_now_add=True)#enregistre le jour et l'heure exact ou le candidat clique sur le bouton Postueler,il prends l'heure de l'ordinateur automatiquement 
    status=models.CharField(max_length=50,default='En attente')#cree un texte court dans la base de donnees pour que qund une candiadature arrive django  remplit automatiquement la case en attente
    dateModification = models.DateTimeField(auto_now =True)# met a jpour automatiquement la date a chaque fois que quelqu'un touche a la candidature
    """
Champ pour recevoir le fichier PDF du CV (rangé dans le sous-dossier 'cvs')
# blank=True et null=True permettent de faire des tests sans être obligée de mettre un fichier
     """
    cv = models.FileField(upload_to = 'cvs/',blank=True,null=True)
    #reception de la lettre de motivation
    lettreMotivation = models.FileField(upload_to = 'lettres/',blank=True,null=True)
     # Relie la candidature à la table Candidat. Si le candidat est supprimé, la candidature s'efface (CASCADE).
      # 'candidat' (minuscule) accueillera l'instance réelle (le vrai utilisateur connecté).
    # 'Candidat' (majuscule) désigne la classe générale (le plan ou la table cible).
    # --- RELATIONS TEMPORAIRES (Pour éviter de bloquer le projet) ---
    # On remplace les flèches par du texte pour stocker temporairement les identifiants
    candidat_id = models.CharField(max_length=50, blank=True, null=True)
    offre_id = models.CharField(max_length=50, blank=True, null=True)

def __str__(self):
    return f'Candidature {self.id} - Statut: {self.status}'

