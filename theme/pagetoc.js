// src: https://github.com/JorelAli/mdBook-pagetoc

// Un-active everything when you click it
Array.prototype.forEach.call(document.getElementsByClassName("pagetoc")[0].children, function(el, i) {
    el.addEventHandler("click", function() {
        Array.prototype.forEach.call(document.getElementsByClassName("pagetoc")[0].children, function(el, i) {
            el.classList.remove("active");
        });
        el.classList.add("active");
    });
});

var updateFunction = function() {

    var id;
    var elements = document.getElementsByClassName("header");
    Array.prototype.forEach.call(elements, function(el, i) {
        if (window.pageYOffset >= el.offsetTop) {
            id = el;
        }
    });

    Array.prototype.forEach.call(document.getElementsByClassName("pagetoc")[0].children, function(el, i) {
        el.classList.remove("active");
    });

    Array.prototype.forEach.call(document.getElementsByClassName("pagetoc")[0].children, function(el, i) {
        if (id.href.localeCompare(el.href) == 0) {
            el.classList.add("active");
        }
    });
};

// Populate sidebar on load
window.addEventListener('load', function() {
    var pagetoc = document.getElementsByClassName("pagetoc")[0];
    var elements = document.getElementsByClassName("header");
    Array.prototype.forEach.call(elements, function(el, i) {
        var link = document.createElement("a");

        // Indent shows hierarchy
        var indent = "";
        switch (el.parentElement.tagName) {
            case "H2":
                indent = "20px";
                break;
            case "H3":
                indent = "40px";
                break;
            case "H4":
                indent = "60px";
                break;
            default:
                break;
        }

        link.appendChild(document.createTextNode(el.text));
        link.style.paddingLeft = indent;
        link.href = el.href;
        pagetoc.appendChild(link);
    });
    updateFunction.call();
});

// Social media footer links
function addSocialIcons() {
  var socialIcons = document.createElement("div");
  socialIcons.className = "social-icons";
  socialIcons.innerHTML = "<a href='https://t.me/nymchan'><img src='/images/icons/telegram_icon.png'></a><a href='https://twitter.com/nymproject'><img src='/images/icons/twitter_icon.png'><a href='https://matrix.to/#/#general:nymtech.chat'><img src='/images/icons/element_icon.png'></a><a href='https://www.reddit.com/r/nym/'><img src='/images/icons/reddit_icon.png'><a href='https://discord.com/invite/nym'><img src='/images/icons/discord_icon.png'></a><a href='https://www.youtube.com/@Nymtech'><img src='/images/icons/youtube_icon.png'></a>";
  var body = document.getElementsByTagName("body")[0];
  body.appendChild(socialIcons);
}

window.addEventListener("DOMContentLoaded", addSocialIcons);


// Handle active elements on scroll
window.addEventListener("scroll", updateFunction);
