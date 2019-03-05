define(['app/tools/profile', 'app/tools/materials', 'app/tools/minimap', 'app/tools/chat'], function(Profile, Materials, Minimap, Chat) {
    class Tools {
        constructor(game) {
            this.game = game;

            this.container = new Container();
            this.titleBarContainer = new Container();
            this.toolContainer = new Container();
            this.iconsContainer = new Container();

            this.toolTitle = new Text();
            this.minimizeIcon = new Sprite();
            this.profileIcon = new Sprite();
            this.materialsIcon = new Sprite();
            this.minimapIcon = new Sprite();
            this.chatIcon = new Sprite();

            this.profile = new Profile();
            this.materials = new Materials();
            this.minimap = new Minimap();
            this.chat = new Chat();

            this.loader = new Loader();

            this.RESOURCE_URL = {
                "PROFILE": './resources/gfx/ui/tools/profile.png',
                "MATERIALS": './resources/gfx/ui/tools/materials.png',
                "MINIMAP": './resources/gfx/ui/tools/minimap.png',
                "CHAT": './resources/gfx/ui/tools/chat.png',
                "MINIMIZE": './resources/gfx/ui/tools/minimize.png'
            };

            //TEMP
            this.increment = 0;
        }

        init() {
            console.log('tools init');
            this.container.position.set(0, 230);
            this.container.width = 300;
            this.container.height = 700;

            this.titleBarContainer.position.set(0, 0);
            this.titleBarContainer.width = 300;
            this.titleBarContainer.height = 30;

            this.toolTitle.style = {
                "fontFamily": 'Arial',
                "fontSize": 20,
                "fill": 0xFFFFFF,
                "align": 'center'
            };
            this.toolTitle.text = 'Tool Title';
            this.toolTitle.position.set(5, 5);

            this.toolContainer.position.set(0, 30);
            this.toolContainer.width = 300;
            this.toolContainer.height = 300;

            this.iconsContainer.position.set(0, 330);
            this.iconsContainer.width = 300;
            this.iconsContainer.height = 40;

            let titleBarBackground = new Graphics();
            titleBarBackground.beginFill(0x666666);
            titleBarBackground.drawRect(0, 0, 300, 30);
            titleBarBackground.endFill();
            this.titleBarContainer.addChild(titleBarBackground);

            let toolBackground = new Graphics();
            toolBackground.beginFill(0xCCCCCC);
            toolBackground.drawRect(0, 0, 300, 300);
            toolBackground.endFill();
            this.toolContainer.addChild(toolBackground);

            let iconsBackground = new Graphics();
            iconsBackground.beginFill(0x666666);
            iconsBackground.drawRect(0, 0, 300, 40);
            iconsBackground.endFill();
            this.iconsContainer.addChild(iconsBackground);

            this.titleBarContainer.addChild(this.toolTitle);
            this.container.addChild(this.titleBarContainer);
            this.container.addChild(this.toolContainer);
            this.container.addChild(this.iconsContainer);

            this.toolContainer.addChild(this.profile.container);
            this.toolContainer.addChild(this.materials.container);
            this.toolContainer.addChild(this.minimap.container);
            this.toolContainer.addChild(this.chat.container);

            console.log('this.RESOURCE_URL:' + Object.keys(this.RESOURCE_URL));
            let icons = this.getValuesArray(this.RESOURCE_URL);
            this.loader.add(icons).load(this.resourcesLoaded.bind(this));
        }

        resourcesLoaded() {
            console.log('tools resourcesLoaded');
            this.genereteUI();
            this.game.resourcesLoaded();
        }

        genereteUI() {
            console.log('genereteUI');
            this.createToolsIcon(this.minimizeIcon, 270, 0, 30, 30, this.RESOURCE_URL.MINIMIZE);
            this.createToolsIcon(this.profileIcon, 0, 0, 40, 40, this.RESOURCE_URL.PROFILE);
            this.createToolsIcon(this.materialsIcon, 40, 0, 40, 40, this.RESOURCE_URL.MATERIALS);
            this.createToolsIcon(this.minimapIcon, 80, 0, 40, 40, this.RESOURCE_URL.MINIMAP);
            this.createToolsIcon(this.chatIcon, 120, 0, 40, 40, this.RESOURCE_URL.CHAT);

            this.titleBarContainer.addChild(this.minimizeIcon);
            this.iconsContainer.addChild(this.profileIcon);
            this.iconsContainer.addChild(this.materialsIcon);
            this.iconsContainer.addChild(this.minimapIcon);
            this.iconsContainer.addChild(this.chatIcon);

            //TEMP
            this.materials.init();
            this.profile.init();

            //put this in a function
            this.titleBarContainer.visible = false;
            this.toolContainer.visible = false;
            this.profile.hide();
            this.materials.hide();
            this.minimap.hide();
            this.chat.hide();

        }

        createToolsIcon(sprite, x, y, width, height, src) {
            console.log('createToolsIcon src:' + src);
            sprite.texture = this.loader.resources[src].texture;
            sprite.position.set(x, y);
            sprite.width = width;
            sprite.height = height;
            sprite.interactive = true;
            sprite.on('click', this.selectTool.bind(this));
        }

        selectTool(e) {
            console.log('tools selectTool:' + e);
            this.titleBarContainer.visible = true;
            this.toolContainer.visible = true;

            this.profile.hide();
            this.materials.hide();
            this.minimap.hide();
            this.chat.hide();

            let target = e.currentTarget;
            switch (target) {
                case this.profileIcon:
                    console.log('profile');
                    this.profile.show();
                    break;
                case this.materialsIcon:
                    console.log('materials');
                    this.materials.show();
                    break;
                case this.minimapIcon:
                    console.log('minimap');
                    this.minimap.show();
                    break;
                case this.chatIcon:
                    console.log('chat');
                    this.chat.show();
                    break;
                case this.minimizeIcon:
                    console.log('minimize');
                    this.titleBarContainer.visible = false;
                    this.toolContainer.visible = false;
                    break;
            }
        }

        addItem() {
            this.materials.addItem(this.materials.RESOURCE_URL.BOOK, 'libro' + this.increment, 'description' + this.increment, this.increment);
            this.increment++;
        }

        getValuesArray(obj) {
            let urls = Object.keys(obj);
            let array = []
            for (let url of urls) {
                array.push(this.RESOURCE_URL[url]);
            }
            return array;
        }

        //
        updateMinimapObject(objectId, x, y) {
            this.minimap.updateObject(objectId, x, y);
        }
    }
    return Tools;
});