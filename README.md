# Groupomania Intranet
Ce dépôt contient le _front-end_ et le _back-end_ en communication avec une  _base données MySQL_ du réseau social intranet de Groupomania, qui permet d'intégrer des messages et des fichiers.

---

## Contents
* [Démarrage rapide](#Démarrage-rapide)
* [Prérequis](#Prérequis)
* [Exécution](#Exécution)
* [Inscription](#Inscription)
* [Connexion](#Connexion)
* [Sauvegarde](#Sauvegarde)
* [Auteur](#Auteur)


## Démarrage rapide
Ces instructions vont vous permettre d'obtenir une copie fonctionnelle du projet sur votre poste de travail.

## Prérequis
Afin de pouvoir exécuter l'application sur votre poste de travail, vous devez d'abord installer les dépendances suivantes :
 1. NodeJS 14
 
### Installation
  1. Installer Node.js et npm via npm install dans le terminal
  2. Cloner le dépôt GitHub https://github.com/Dompou06/DominiquePourriere_7_20052021.git
  
---
 
## Exécution
Suivre [cette procédure] pour lancer l'application.
 
Exécuter `npm start` depuis le back-end

---

### Inscription

1. Votre *email* devra être valide et ne pas être déjà inscrit dans la base de données
2. Votre *password* devra comporter 8 à 15 signes ainsi qu'au moins une lettre minuscule et une majuscule, un chiffre et un caractère spécial équivalent -, +, !, *, $, @, % ou _

### Connexion

1. Vous devez vous être déjà inscrit
2. Au bout de cinq essais de password invalides, pendant une minute, les tentatives suivantes seront rejetées

---

## Sauvegarde
### de la base de données
1. Sur Windows, vérifiez que MySQL est configuré dans l'invite de commande, en tapant mysql --help. Si une erreur est affichée, ajoutez MySQL au path de votre système. 
2. Dans l'invite de commande, parcourez l'arborescence pour indiquer où votre ficier de sauvegarde sera situé.
3. Puis importez le dump en tapant : mysqldump -u[nom d'utilisateur de la base de données] -p [nom de la base de données] > [nom du fichier de la sauvegarde].sql
5. Cliquez sur Entrée
6. Intégrez le mot de passe de l'utilisateur de la base de données.

#### Si votre base de données n'est pas en local
1. récupérez sont host
2. Puis importez le dump en tapant : mysqldump --host=[host récupéré si base de données externe] -u[nom d'utilisateur de la base de données] -p [nom de la base de données] > [nom du fichier de la sauvegarde].sql

#### Si vous ne souhaitez que la structre de la base de données
1. Ajoutez --no-data à votre ligne de commande
2. mysqldump --host=[host récupéré si base de données externe] -u[nom d'utilisateur de la base de données] -p --no-data [nom de la base de données] > [nom du fichier de la sauvegarde].sql

#### Fichier de sauvegarde
1. Vous trouverez votre fichier de sauvegarde dans le dossier que vous avez désigné.
2. En cas de problème avec votre base de données, vous pourrez ainsi la restaurer en remplaçant > dans la ligne de commande par <

---

## Auteur
Pourrière Dominique
