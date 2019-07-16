const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;
let addWindow;
//listen for the app to be ready
app.on('ready', function(){
        //Create new window
        mainWindow = new BrowserWindow({});
        //load html into window
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'mainWindow.html'),
            protocol:'file',
            slashes:true
        }));
        //Quit app when closed
        mainWindow.on('closed', function(){
            app.quit();
        });
        //build menu from template
        const MainMenu = Menu.buildFromTemplate(mainMenuTemplate);
        //Insert menu
        Menu.setApplicationMenu(MainMenu);
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
                pathname: path.join(__dirname, 'addWindow.html'),
                protocol:'file',
                slashes:true
                    }));
    }

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
               label : 'Clear Item'
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