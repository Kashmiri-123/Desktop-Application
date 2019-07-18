const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu,ipcMain} = electron;

let mainWindow;
let addWindow;
//listen for the app to be ready
app.on('ready', function(){
        //Create new window
        mainWindow = new BrowserWindow({});
        //load html into window
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'MainWindow.html'),
            protocol:'file',
            slashes:true
        }));
        //Quit app when closed
        mainWindow.on('closed', function(){
            app.quit();
        });
        //build menu from template
        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
        //Insert menu
        Menu.setApplicationMenu(mainMenu);
});

//Handle create add window
function createAddWindow()
    {
    //Create new window
    addWindow = new BrowserWindow({
                width:300,
                height:200,
                title: 'Add Shopping List Item'
                    });
    //load html into window
    addWindow.loadURL(url.format({
                pathname: path.join(__dirname, 'AddWindow.html'),
                protocol:'file',
                slashes:true
                    }));
                    
     //Garbage collection handle.cause even after closing the menu it still occupies the space
     addWindow.on('close', function(){
        addWindow = null;
    });
    }

     //catch item:add
     ipcMain.on('item:add',function(e,item){
        console.log(item);
        mainWindow.webContents.send('item:add', item);
        addWindow.close();
    });


//Create menu Template
const mainMenuTemplate = [
    {
        label : 'File',
        submenu : [
            {
                label : 'Add Item',
                click()
                {
                   createAddWindow();
                }
           },
           {
               label : 'Clear Item',
               click()
               {
                   mainWindow.webContents.send('item:clear');
               }
           },
           {
               label : 'Quit',
               accelerator : process.platform == 'darwin ' ? 'command+Q':
               'Ctrl+Q',
               click()
               {
                   app.quit();
               }
           }
                ]
    }
];


//if in mac then the Menu name "file" will be written as "electron" so to overcome this
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

//add developer tool item if not in production
if(process.env.NODE_ENV !== 'production'){
mainMenuTemplate.push({
    label : 'Developer Tools',
    submenu : [
        {
            label : 'Toggle DevTools',
            accelerator : process.platform == 'darwin ' ? 'Command+I':
            'Ctrl+I',
            click(item, focusedWindow){
                focusedWindow.toggleDevTools(); 
            }
        },
        {
            role : 'reload'
        }
    ]
});
}