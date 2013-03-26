

//These variables are used to define the server
	//shutdown window.
	
private var serverDisWindowRect : Rect;

private var serverDisWindowWidth : int = 300;

private var serverDisWindowHeight : int = 150;

private var serverDisWindowLeftIndent : int = 10;

private var serverDisWindowTopIndent : int = 10;


//These variables are used to define the client
//disconnect window.

private var clientDisWindowRect : Rect;

private var clientDisWindowWidth :int = 300;

private var clientDisWIndowHeight :int = 170;
	
	
private var showDisconnectWindow : boolean = false;

private var serverName : String;

function Start () {
	//serverName = PlayerPrefs.GetString("serverName");
	serverName = GameObject.Find("Main").serverName;
}

function Update () {
	if (Input.GetKeyDown(KeyCode.Escape)) {
		showDisconnectWindow = !showDisconnectWindow;	
	}	
}

function OnGUI() {
	showWindow();
}

function ServerDisconnectWindow (windowID : int) {
	GUILayout.Label("Server name: " + serverName);
	
	
	//Show the number of players connected.
	
	GUILayout.Label("Number of players connected: " + Network.connections.Length);
	
	
	//If there is at least one connection then show the average ping.
	
	if(Network.connections.Length >= 1){
		GUILayout.Label("Ping: " + Network.GetAveragePing(Network.connections[0]));	
	}
	
	
	//Shutdown the server if the user clicks on the Shutdown server button.
	
	if(GUILayout.Button("Shutdown server")){
		Network.Disconnect();	
	}
}
	

function ClientDisconnectWindow(windowID : int)
{
	//Show the player the server they are connected to and the
	//average ping of their connection.
	
	GUILayout.Label("Connected to server: " + serverName);
	
	GUILayout.Label("Ping; " + Network.GetAveragePing(Network.connections[0]));	
	
	GUILayout.Space(7);
		
	//The player disconnects from the server when they press the 
	//Disconnect button.
	
	if(GUILayout.Button("Disconnect", GUILayout.Height(25)))
	{
		Network.Disconnect();	
	}
	
	
	GUILayout.Space(5);
	
	
	//This button allows the player using a webplayer who has can gone 
	//fullscreen to be able to return to the game. Pressing escape in
	//fullscreen doesn't help as that just exits fullscreen.
	
	if(GUILayout.Button("Return To Game", GUILayout.Height(25)))
	{
		showDisconnectWindow = false;	
	}
}

function showWindow() {

	if(Network.peerType == NetworkPeerType.Server && showDisconnectWindow == true)
	{
		//Defining the Rect for the server's disconnect window.
		Debug.Log("Server peer");
		
		serverDisWindowRect = new Rect(serverDisWindowLeftIndent, serverDisWindowTopIndent,
		                               serverDisWindowWidth, serverDisWindowHeight);
		
		serverDisWindowRect = GUILayout.Window(1, serverDisWindowRect, ServerDisconnectWindow, "");
		
		
	}
	
	
	//If the connection type is a client (a player) then show a window that allows
	//them to disconnect from the server.
	
	if((Network.peerType == NetworkPeerType.Client) && showDisconnectWindow == true)
	{
	Debug.Log("Client/server peer");
		clientDisWindowRect = new Rect(Screen.width / 2 - clientDisWindowWidth / 2,
		                               Screen.height / 2 - clientDisWIndowHeight / 2,
		                               clientDisWindowWidth, clientDisWIndowHeight);
		
		clientDisWindowRect = GUILayout.Window(1, clientDisWindowRect, ClientDisconnectWindow, "");
	}

}