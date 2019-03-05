define(function() {
    class Materials {
        constructor() {
            this.container = new Container();

            this.items = [];

            this.loader = new Loader();

            this.RESOURCE_URL = {
                "BOOK": './resources/gfx/ui/items/book.png'
            };
        }

        init() {
            console.log('this.RESOURCE_URL:' + Object.keys(this.RESOURCE_URL));
            let icons = this.getValuesArray(this.RESOURCE_URL);
            this.loader.add(icons).load(this.resourcesLoaded.bind(this));
        }

        show() {
            this.container.visible = true;
        }

        hide() {
            this.container.visible = false;
        }

        resourcesLoaded() {
            console.log('Materials resourcesLoaded');
            /*for(let i=0;i<4;i++){
            	this.addItem(this.RESOURCE_URL.BOOK,'libro'+i,'description'+i,i);
            }*/
        }

        addItem(type, name, description, id) {

            let item = new Container();
            item.id = id;
            item.interactive = true;
            item.on('click', this.openItem.bind(this));

            let itemIcon = new Sprite(this.loader.resources[type].texture);

            let backgroundItem = new Graphics();
            backgroundItem.beginFill(0x004444);
            backgroundItem.drawRect(0, 0, 300, 40);
            backgroundItem.beginFill();

            let nameText = new Text();
            nameText.position.set(40, 0);
            nameText.style = {
                "fontFamily": 'Arial',
                "fontSize": 20,
                "fill": 0xFFFFFF,
                "align": 'left'
            };
            nameText.text = name;

            let descriptionText = new Text();
            descriptionText.position.set(40, 20);
            descriptionText.style = {
                "fontFamily": 'Arial',
                "fontSize": 16,
                "fill": 0xFFFFFF,
                "align": 'left'
            };
            descriptionText.text = description;

            item.addChild(backgroundItem);
            item.addChild(itemIcon);
            item.addChild(nameText);
            item.addChild(descriptionText);

            item.y = this.items.length * 40;
            this.container.addChild(item);
            this.items.push(item);
        }

        openItem(e) {
            let target = e.currentTarget;
            console.log('target.id:' + target.id);
            // /resources/content/1
            document.getElementById('pdfView').className = '';
            document.getElementById('pdfView').onclick = (e) => {
                e.currentTarget.className = 'hidden';
            }
        }

        getValuesArray(obj) {
            let urls = Object.keys(obj);
            let array = []
            for (let url of urls) {
                array.push(this.RESOURCE_URL[url]);
            }
            return array;
        }
    }
    return Materials;
});