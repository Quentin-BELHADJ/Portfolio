document.addEventListener("DOMContentLoaded", function () {
	fetch("navbar.html")
		.then(response => response.text())
		.then(data => {
			document.getElementById("navbar-container").innerHTML = data;
		})
		.catch(error => console.error("Erreur lors du chargement de la navbar :", error));

        let lastScrollTop = 0;
        let navbar;
        
        document.addEventListener("scroll", function () {
            if (!navbar) {
                navbar = document.querySelector(".navbar");
                if (!navbar) return;
            }
        
            let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
            if (currentScroll > lastScrollTop) {
                // Scroll vers le bas : cacher la navbar
                navbar.style.top = "-100px";
            } else {
                // Scroll vers le haut : afficher la navbar
                navbar.style.top = "0";
            }
            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        });        

});
