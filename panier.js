$(document).ready(function() {
  //variable qui va stocker tous les produits avec les informations
  var panier = [];

  /* Charge dynamiquement le fichier aide.html */
  $(".modal-body").load("aide.html");

  //met à jour le compteur en fonction de la taille du panier
  function ajoutProduit() {
    $("#gestionpanier").text(panier.length + 1);
  }

  //met à jour le compteur en fonction de la taille du panier
  function enleveProduit() {
    $("#gestionpanier").text(panier.length);
  }

  //quand on change de code dans l'input on affiche dynamiquement son prix
  $("#code").change(function() {
    var code = $("#code").val();
    panier.map(element => {
      if (element.Code === code) {
        document.getElementById("prixuni").value = element.Prixuni;
      }
    });
  });

  //affiche un message vert sous le bouton Ajouter pour nous dire que l'ajout est passé
  function succes() {
    var err = $("#succ");
    err.show();
    setTimeout(function() {
      err.hide();
    }, 5000);
  }

  //affiche un message rouge sous le bouton Ajouter pour nous dire que l'ajout n'est pas passé
  function suppr() {
    var succ = $("#suppr");
    succ.show();
    setTimeout(function() {
      succ.hide();
    }, 5000);
  }

  //ajout d'un produit à partir du formulaire
  $("#formAjout").submit(function(event) {
    event.preventDefault();

    //création du prix random
    var random = Math.round(Math.random() * 100);

    //récupération des valeurs du formulaire
    var code = $("#code").val();
    var qte = $("#qte").val();

    //le prix uni est égal au random
    var prixuni = random;
    document.getElementById("prixuni").value = prixuni;

    var prixtotalligne = prixuni * qte;

    //retourne une array si le produit déjà
    var filterpanier = panier.filter(element => element.Code === code);

    //permet d'avoir une code unique pour les ids dans les td
    var codeneg = code * -1;

    //si filterpanier est vide alors l'élément n'existe pas donc on l'ajoute dans le back et le front
    if (filterpanier.length === 0) {
      var newobject = {
        Code: code,
        Qte: qte,
        Prixtotalligne: prixtotalligne,
        Prixuni: prixuni
      };

      $("#tabChart").append(
        `<tr>` +
          `<td>` +
          code +
          "</td>" +
          `<td id=${code}>` +
          qte +
          "</td>" +
          `<td>` +
          prixuni +
          "</td>" +
          `<td id=${codeneg} >` +
          prixtotalligne +
          "</td>" +
          `<td id=${code} class=\"supprimer\"><a href=\"#\" <i class=\"fa fa-trash-o\" style=\"font-size:36px\"></i></a></td>` +
          "</tr>"
      );

      succes();
      ajoutProduit();

      //ajout le nouvel élément dans le panier
      panier.push(newobject);
    }

    //sinon le produit est déjà présent
    else {
      //parcours le panier par objet jusqu"à trouver l'objet qui à le même code article que le nouveau
      panier.map(element => {
        if (element.Code === code) {
          //mise à jour de la quantité et du prix total de la ligne en fonction de l'ancien prix dans le back
          var newqte = parseInt(qte) + parseInt(element.Qte);
          var oldprixuni = element.Prixuni;
          var newtotalligne = newqte * oldprixuni;
          element.Qte = newqte;
          element.Prixtotalligne = newtotalligne;

          //mise à jour de la quantité et du prix total de la ligne en fonction de l'ancien prix dans le front
          document.getElementById(`${code}`).innerHTML = newqte;
          document.getElementById(`${codeneg}`).innerHTML = newtotalligne;
        }
      });
    }

    //mise à jour du total
    var cpt = 0;
    panier.map(element => {
      cpt += element.Prixtotalligne;
    });
    document.getElementById("total").innerHTML = cpt;
    console.log(panier);

    //suppression d'un produit avec mise à jour dans le panier et dans le total
    $(".supprimer").click(function() {
      //parcours du panier par objet
      panier.map(element => {
        //quand on clique sur le bouton supprimer on récupère l'id  de la td qui lui est associé
        //et qui correspond au code de l'article d'où le this
        if (element.Code === this.id) {
          //récupère le prix total de la ligne
          var prixtotallignedelete = element.Prixtotalligne;

          //récupère le prix total du panier
          var x = parseInt(document.getElementById("total").textContent);

          //met à jour en lui enlevant le prixtotal de l'élément supprimé
          document.getElementById("total").innerHTML = x - prixtotallignedelete;

          //supprime le produit dans le panier côté back
          panier.splice(panier.indexOf(element), 1);
        }
      });
      console.log(panier);

      $(this)
        .parents("tr")
        .remove();
      suppr();
      enleveProduit();
    });
  });

  //affiche la fenêtre modal d'aide quand on clique sur le bouton
  $("#aide").click(function(event) {
    event.preventDefault();
  });
});
