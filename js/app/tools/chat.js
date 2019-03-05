define(function() {
    class Chat {
        constructor() {
            this.container = new Container();
        }

        init() {

        }

        show() {
            this.container.visible = true;
        }

        hide() {
            this.container.visible = false;
        }
    }
    return Chat;
});