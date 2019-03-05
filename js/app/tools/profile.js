define(function() {
    class Profile {
        constructor() {
            this.container = new Container();

            this.userNameText = new Text();
            this.profileIcon = new Sprite();
            this.statsContainer = new Container();
        }

        init() {

            this.userNameText.text = 'User name';
            this.userNameText.style = {
                "fontFamily": 'Arial',
                "fontSize": 20,
                "fill": 0xFFFFFF,
                "align": 'left'
            };
            this.userNameText.position.set(10, 10);

            this.profileIcon.position.set(230, 10);

            this.statsContainer.position.set(50, 80);


            let profileBackground = new Graphics();
            profileBackground.beginFill(0xFFFFFF);
            profileBackground.drawRect(0, 0, 60, 60);
            profileBackground.endFill(0xFFFFFF);
            this.profileIcon.addChild(profileBackground);

            let statsBackground = new Graphics();
            statsBackground.beginFill(0xFFFFFF);
            statsBackground.drawRect(0, 0, 200, 200);
            statsBackground.endFill(0xFFFFFF);
            this.statsContainer.addChild(statsBackground);

            this.container.addChild(this.userNameText);
            this.container.addChild(this.profileIcon);
            this.container.addChild(this.statsContainer);
        }

        show() {
            this.container.visible = true;
        }

        hide() {
            this.container.visible = false;
        }
    }
    return Profile;
});