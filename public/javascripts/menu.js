const menu = $(".menu");
var menuVisible = false;

const toggleMenu = command => {
    command === "show" ? menu.show(500) : menu.hide(500);
    menuVisible = !menuVisible;
};

const setPosition = ({ top, left }) => {
    menu.css('left', `${left}px`);
    menu.css('top', `${top}px`);
    toggleMenu("show");
};

window.addEventListener("click", e => {
    if (menuVisible) toggleMenu("hide");
});

window.addEventListener("contextmenu", e => {
    e.preventDefault();
    const origin = {
        left: e.pageX,
        top: e.pageY
    };
    setPosition(origin);
    return false;
});