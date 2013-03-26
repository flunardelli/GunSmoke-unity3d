
var lobbyLogoTexture : Texture2D;
var mainLogoTexture : Texture2D;

var player1Texture : Texture2D;
var player2Texture : Texture2D;
var player3Texture : Texture2D;
var player4Texture : Texture2D;

var mainTexture : Texture2D;
var scoreTexture : Texture2D;

var font : Font;
private var buttonText : GUIText;
var currentServer : String;
var currentPort : int;
public var currentPlayerName : String = "";
public var currentPlayer : int = 0;
private var buttonStyle : GUIStyle;
public var labelStyle : GUIStyle;
private var currentBackgroundTexture : Texture2D;
public enum States {Main, MainHost,MainJoin, MainQuit, PlayerSelect, Playing, Score};
public  var currentState : States;
private var chatContent : String = "";
private var chatContentInput : String = "";
private var playersTexture : Texture2D[];

public var defaultServerName : String = "Gunsmoke - Server";

private var titleMessage : String = "Server Administration";
	
private var serverIP : String = "127.0.0.1";

private var serverPort : int = 26500;

private var useNAT : boolean = false;

private var ipAddress : String;

private var port : String;

private var numberOfPlayers : int = 10;

public var playerName : String;

public var playerSkin : String;

public var playerLife : int = 3;

public var serverName : String;

private var serverNameForClient : String;

private var iWantToSetupAServer : boolean = false;

private var iWantToConnectToAServer : boolean = false;

private var connectionWindowRect : Rect;

private var connectionWindowWidth :int = 400;

private var connectionWindowHeight :int = 280;


private var leftIndent: int;

private var topIndent : int;

private var lastUnfocusTime : float = 0;

private var scrollPosition : Vector2;

private var scrollPositionPlayers : Vector2;

private var showChat : boolean= false;

public var playerList = new ArrayList();

private var updatePlayerListNode : boolean = false;

private var chatEntries = new ArrayList();

private var counterJoin : int = 0;

public var minPlayers : int = 2;

public var counterTimer : float;

public var infoMessage : String;

public var counterInfoMessage : float = 0.0f;

public var counterTimerDefault : float = 300.0f;

//public var starting : boolean = false;

//public var inGame : boolean = false;

class PlayerNode {
	var playerName : String;
	var networkPlayer : NetworkPlayer;
	var playerSkin : String;
	var playerLife : int;
}


class ChatEntry {
	var name : String= "";
	var text : String= "";	
}

function OnGUI () {

	playersTexture = [player1Texture, player2Texture, player3Texture, player4Texture];
	
	labelStyle = new GUIStyle();
	
	labelStyle.normal.textColor = Color.white;
	
	labelStyle.font = font;
	labelStyle.fontSize = 28;
	
	buttonStyle = new GUIStyle();
	
	if (buttonStyle){	
		buttonStyle.normal.background = null;
	}

	showWindow ();	
	
	if (currentState == States.Main) {
									
		GUILayout.BeginArea (Rect (0,0,Screen.width,Screen.height));
				
			GUILayout.BeginHorizontal();
			GUILayout.FlexibleSpace();
							
				GUILayout.BeginVertical();
				GUILayout.Space (60);
				GUILayout.BeginHorizontal();
					GUILayout.FlexibleSpace();		
					GUILayout.Label(mainLogoTexture,GUILayout.Width(600),GUILayout.Height(300));
					GUILayout.FlexibleSpace();
				GUILayout.EndHorizontal();
				
				GUILayout.Space (100);
					
				GUILayout.BeginHorizontal();
					GUILayout.FlexibleSpace();
					
					if (GUILayout.Button("Host New Game",GUILayout.Width(161), GUILayout.Height(50))) {
						currentState = States.MainHost;
					}	
					if (GUILayout.Button("Join Game", GUILayout.Width(161), GUILayout.Height(50))) {
						currentState = States.MainJoin;
					}
					
					if (GUILayout.Button("Quit", GUILayout.Width(161), GUILayout.Height(50))) {
						currentState = States.MainQuit;
					}
					
					GUILayout.FlexibleSpace();
				GUILayout.EndHorizontal();
				GUILayout.EndVertical();				
		
			GUILayout.FlexibleSpace();
			GUILayout.EndHorizontal();
		GUILayout.EndArea();
		
	} else if (currentState == States.PlayerSelect) {
	 	GUI.DrawTexture(Rect (0,0,Screen.width,Screen.height),mainTexture);
		
		GUILayout.BeginArea (Rect (0,0,Screen.width,Screen.height));
	 			
				
			GUILayout.BeginHorizontal();
			GUILayout.FlexibleSpace();
								
			GUILayout.FlexibleSpace();				
			GUILayout.BeginVertical();
				
				GUILobbyLogo();
							
				GUILayout.Space (15);
				
				GUILobbyPlayerSelect();
				
						
				GUILayout.Space (5);
				
				GUILobbyChat();			
				
			GUILayout.EndVertical();				
			GUILayout.FlexibleSpace();			
		
			GUILayout.FlexibleSpace();
			GUILayout.EndHorizontal();
			
		GUILayout.EndArea();
							
	} /*else if (currentState == States.Score) {
		GUI.DrawTexture(Rect (0,0,Screen.width,Screen.height),scoreTexture);
		
		GUILayout.BeginArea (Rect (0,0,Screen.width,Screen.height));
	 			
				
			GUILayout.BeginHorizontal();
			GUILayout.FlexibleSpace();
								
			GUILayout.FlexibleSpace();				
			GUILayout.BeginVertical();
				
				
				
			GUILayout.EndVertical();				
			GUILayout.FlexibleSpace();			
		
			GUILayout.FlexibleSpace();
			GUILayout.EndHorizontal();
			
		GUILayout.EndArea();
	
	}*/
	
}

function GUILobbyLogo() {
	GUILayout.BeginHorizontal(GUILayout.Width(616));
		GUILayout.FlexibleSpace();		
			GUILayout.Label(lobbyLogoTexture,GUILayout.Width(288),GUILayout.Height(160));
		GUILayout.FlexibleSpace();
	GUILayout.EndHorizontal();
}

function GUILobbyPlayerSelect(){
	GUILayout.BeginHorizontal(GUILayout.Width(616));														
		GUILayout.Label("Choose your outlaw", labelStyle, GUILayout.Width(200), GUILayout.Height(27));						
	GUILayout.EndHorizontal();
	
	GUILayout.BeginHorizontal(GUILayout.Width(616));
		GUILayout.Space (10);
		GUILayout.FlexibleSpace();											
			currentPlayer = GUILayout.Toolbar(currentPlayer, playersTexture, buttonStyle, GUILayout.Width(595), 
			GUILayout.Height(180));		
		GUILayout.FlexibleSpace();
	GUILayout.EndHorizontal();
		
	GUILayout.BeginHorizontal(GUILayout.Width(616));
	
	GUILayout.FlexibleSpace();
		for (var i:int = 0; i < playersTexture.length; i++){			
			var p : PlayerNode;			
			for (var pt : PlayerNode in playerList){
				if (pt.playerSkin == playersTexture[i].name){									
					p = pt;
					break;
				}
			}
			if (p){	
				if (p.networkPlayer == Network.player) {
					if (GUILayout.Button("Cancel\n"+playerName, GUILayout.Width(145))){
							networkView.RPC ("TellServerOurData", RPCMode.AllBuffered, playerName, "", playerLife, Network.player);
					}
				} else {
					GUILayout.BeginHorizontal(GUILayout.Width(145));
						GUILayout.FlexibleSpace();
							GUILayout.Label("Joined\n"+p.playerName);
						GUILayout.FlexibleSpace();
					GUILayout.EndHorizontal();
				}						
			} else {
				if (playerSkin == "") {
					if (GUILayout.Button("Join\n"+playerName, GUILayout.Width(145))){
						Debug.Log("Choosed");
						networkView.RPC ("TellServerOurData", RPCMode.AllBuffered, playerName, playersTexture[i].name, playerLife, Network.player);
					}
				} else {
					GUILayout.BeginHorizontal(GUILayout.Width(145));
						GUILayout.FlexibleSpace();
							GUILayout.Label("Waiting\n");
						GUILayout.FlexibleSpace();
					GUILayout.EndHorizontal();
				}
			}
		}
		GUILayout.FlexibleSpace();					
	GUILayout.EndHorizontal();

}

function GUILobbyChat() {
	GUILayout.BeginHorizontal(GUILayout.Width(616));					
		
		//GUILayout.FlexibleSpace();												
		GUILayout.BeginVertical(GUILayout.Width(400));																				
			//CHAT
			GUILayout.Label("Chat", labelStyle, GUILayout.Width(50), GUILayout.Height(25));
			GUILayout.BeginHorizontal();														
				if (Event.current.type == EventType.keyDown && Event.current.character == "\n" && 
					chatContentInput.Length <= 0){
					if(lastUnfocusTime+0.25<Time.time){
						usingChat=true;
						GUI.FocusControl("ChatInput");
					}
				}
				
				scrollPosition = GUILayout.BeginScrollView (scrollPosition, GUILayout.Width(400), 
					GUILayout.Height(100));							
				for (var entry : ChatEntry in chatEntries){							
					GUILayout.BeginHorizontal();
					if (entry.name==""){
						GUILayout.Label (entry.text);
					} else {
						GUILayout.Label (entry.name+": "+entry.text);
					}
					GUILayout.EndHorizontal();
					GUILayout.Space(3);								
				}
			    GUILayout.EndScrollView ();
				
				if (Event.current.type == EventType.keyDown && Event.current.character == "\n" && 
					chatContentInput.Length > 0){
					HitEnter(chatContentInput);
				}							
			GUILayout.EndHorizontal();						
			GUILayout.BeginHorizontal();
				GUI.SetNextControlName("ChatInput");
				chatContentInput = GUILayout.TextField(chatContentInput, 100, GUILayout.Width(340));
				if (GUILayout.Button("Send",GUILayout.Width(60), GUILayout.Height(22))){
					Debug.Log("sended");
					HitEnter(chatContentInput);
				}
			GUILayout.EndHorizontal();						
		GUILayout.EndVertical();						
		
		GUILayout.Space(10);							
		//GUILayout.FlexibleSpace();
		GUILayout.BeginVertical(GUILayout.Width(100));
			GUILayout.Label("Players", labelStyle, GUILayout.Width(100), GUILayout.Height(28));
			scrollPositionPlayers = GUILayout.BeginScrollView (scrollPositionPlayers, GUILayout.Width(100), 
				GUILayout.Height(100));
			for (var entry : PlayerNode in playerList) {							
				GUILayout.BeginHorizontal();
				var stat : String = "(w)";
				if (entry.playerSkin != ""){
					stat = "(j)";
				}								
				GUILayout.Label (entry.playerName + " " +stat);								
				GUILayout.EndHorizontal();
				GUILayout.Space(3);								
			}						
			GUILayout.EndScrollView ();						
		GUILayout.EndVertical();
		
		GUILayout.Space(10);
		
		GUILayout.BeginVertical();
			if (Network.peerType == NetworkPeerType.Server) {			
				var loadLabel : String = (counterJoin >= minPlayers) ? "Start\nmatch" : "Waiting\nplayers";
				if (GUILayout.Button(loadLabel,GUILayout.Width(60), GUILayout.Height(60))){	
					if (counterJoin >= minPlayers) {									
						networkView.RPC("LoadMatch", RPCMode.AllBuffered);	
					}
				}
			}
		GUILayout.EndVertical();													
		
	
	GUILayout.EndHorizontal();
			
}


function ConnectWindow (windowID : int) {
	
	GUILayout.Space(15);

	if(iWantToSetupAServer == true)
	{
	
		
		GUILayout.Label("Enter your player name");
		
		
		playerName = GUILayout.TextField(playerName);

		GUILayout.Space(5);

		
		GUILayout.Label("Enter a name for your server");
		
		serverName = GUILayout.TextField(serverName);
		
		
		GUILayout.Space(5);
		
		GUILayout.Label("Server Port");
		
		serverPort = int.Parse(GUILayout.TextField(serverPort.ToString()));
		
		GUILayout.Space(10);
		
		if(GUILayout.Button("Start my own server", GUILayout.Height(30)))
		{
			
			if (playerName == ""){
				playerName = "Player"+Random.Range(1,999);				
			}
			PlayerPrefs.SetString("playerName", playerName);
			
			Network.InitializeServer(numberOfPlayers, serverPort, useNAT);

			
			PlayerPrefs.SetString("serverName", serverName);
			
			
			PlayerPrefs.SetInt("serverPort", serverPort);
			
			iWantToSetupAServer = false;
		}
		
		if(GUILayout.Button("Go Back", GUILayout.Height(30)))
		{
			iWantToSetupAServer = false;
			currentState = States.Main;	
		}
	}
	
	
	if(iWantToConnectToAServer == true)
	{
		
		GUILayout.Label("Enter your player name");
		
		playerName = GUILayout.TextField(playerName);
		
		
		GUILayout.Space(5);
		
		GUILayout.Label("Type in Server IP");
		
		serverIP = GUILayout.TextField(serverIP);
		
		GUILayout.Space(5);

		
		GUILayout.Label("Server Port");
		
		serverPort = int.Parse(GUILayout.TextField(serverPort.ToString()));
		
		GUILayout.Space(5);
		
		
		if(GUILayout.Button("Connect", GUILayout.Height(25)))
		{
			
			if (!playerName || playerName==""){
				playerName = "Player"+Random.Range(1,999);				
			}
			PlayerPrefs.SetString("playerName", playerName);
			
			PlayerPrefs.SetString("serverIP", serverIP);
			
			PlayerPrefs.SetInt("serverPort", serverPort);

			if(playerName != "")
			{

				connectoToServer(serverIP, serverPort);				
			}
		}
		
		GUILayout.Space(5);
		
		if(GUILayout.Button("Go Back", GUILayout.Height(25)))
		{
			iWantToConnectToAServer = false;
			currentState = States.Main;
		}
		
	}
	
}

function connectoToServer(serverIP : String, serverPort :int) {
	Network.Connect(serverIP, serverPort);				
	
}	
				

function OnServerInitialized() {
	Debug.Log("OnServerInitialized");
	currentState = States.PlayerSelect;
	networkView.RPC ("TellServerOurData", RPCMode.AllBuffered, playerName, playerSkin, playerLife, Network.player);
	
	addGameChatMessage(playerName+" joined the game (server - "+Network.player.ipAddress+")");
	
}

function OnDisconnectedFromServer () {

	if (Network.peerType == NetworkPeerType.Server) {
		PlayerData.inGame = false;
	}
	
	Application.LoadLevel("Main");
}

function GetPlayerNode(networkPlayer : NetworkPlayer){
	for (var entry : PlayerNode in  playerList){
		if (entry.networkPlayer==networkPlayer){
			return entry;
		}
	}
	return null;
}

function OnPlayerDisconnected (networkPlayer : NetworkPlayer)
{
	
	Debug.Log("OnPlayerDisconnected -> " + networkPlayer.ToString());
	
	Network.RemoveRPCs(networkPlayer);		
	Network.DestroyPlayerObjects(networkPlayer);
	
	//addGameChatMessage("Player disconnected from: " + networkPlayer.ipAddress+":" + networkPlayer.port);
	
	if (playerList) {
		//Remove player from the server list
		playerList.Remove( GetPlayerNode(networkPlayer) );
	}	
	
	
}


function OnPlayerConnected (networkPlayer : NetworkPlayer) {
	Debug.Log("OnPlayerConnected");
	
	//networkView.RPC ("TellServerOurData", RPCMode.AllBuffered, playerName, playerSkin, playerLife, Network.player);
	//networkView.RPC("TellPlayerServerName", networkPlayer, serverName);	
	//addGameChatMessage("Player connected from: " + networkPlayer.ipAddress +":" + networkPlayer.port);
	
}

function OnConnectedToServer () {	
	Debug.Log("OnConnectedToServer");
	
	if (PlayerData.inGame) {
		Debug.Log("ingame");
		LoadMatch ();
	} else {
		currentState = States.PlayerSelect;
		addGameChatMessage(playerName+" joined the game");
		networkView.RPC ("TellServerOurData", RPCMode.AllBuffered, playerName, playerSkin, playerLife, Network.player);
	}	
}
	
function Quit() {
	if (Application.isWebPlayer == false && Application.isEditor == false){
		Application.Quit();
	}
}

function showWindow () {

	if (currentState == States.MainHost){
		iWantToConnectToAServer = false;
		iWantToSetupAServer = true;	
	} else if (currentState == States.MainJoin) {
		iWantToConnectToAServer = true;
		iWantToSetupAServer = false;
	} else if (currentState == States.MainQuit) {
		Quit();
	}		
	
	if((iWantToSetupAServer == true || iWantToConnectToAServer == true) && 
		Network.peerType == NetworkPeerType.Disconnected)
	{
		
		leftIndent = Screen.width / 2 - connectionWindowWidth / 2;
		
		topIndent = Screen.height / 2 - connectionWindowHeight / 2;
		
		connectionWindowRect = new Rect(leftIndent, topIndent, connectionWindowWidth,
		                                connectionWindowHeight);
		
		connectionWindowRect = GUILayout.Window(0, connectionWindowRect, ConnectWindow,
		                                        titleMessage);
	} 
	
}
	

function getCurrentState () : String {	
	return currentState.ToString();
}

function HitEnter(msg : String){
	msg = msg.Replace("\n", "");
	networkView.RPC("ApplyGlobalChatText", RPCMode.All, playerName, msg);
	chatContentInput = "";
	GUI.UnfocusWindow ();
	lastUnfocusTime=Time.time;
	usingChat=false;
}

function addGameChatMessage(str : String){
	ApplyGlobalChatText("", str);
	if(Network.connections.length>0){
		networkView.RPC("ApplyGlobalChatText", RPCMode.Others, "", str);	
	}	
}

function Awake () {
	
}

function Start () {	
 	
    currentState = States.Main;
    currentServer = "127.0.0.1";
    currentPort = 666;
    
    serverName = PlayerPrefs.GetString("serverName",defaultServerName);
        
    serverIP = PlayerPrefs.GetString("serverIP","127.0.0.1");
					
	playerName = PlayerPrefs.GetString("playerName", "Player"+Random.Range(1,999));
	
	serverPort = PlayerPrefs.GetInt("serverPort", 26500);
	
	playerSkin = "";
	
	PlayerData.inGame = false;

}

function Update () {
	if (PlayerData.inGame == true && Network.isServer && counterTimer > 0) {
		counterTimer -= Time.deltaTime;		 
	}
}


@RPC
function TellPlayerServerName (servername : String) {
	serverName = servername;	
}	


@RPC
function TellServerOurData(name : String, skin : String, life : int, networkPlayer : NetworkPlayer, info : NetworkMessageInfo){
	
	Debug.Log("TellServerOurData -> name: "+name+ " skin: " +skin+ " NetworkPlayer: "+info.sender.ToString());
	
	var newEntry : PlayerNode = new PlayerNode();
	newEntry.playerName = name;
	newEntry.networkPlayer = networkPlayer;
	newEntry.playerSkin = skin;
	newEntry.playerLife = life;

	var newPlayerList = new ArrayList();
	var player : PlayerNode;
		
	for (player in playerList){
		if (player.networkPlayer == newEntry.networkPlayer){
			newPlayerList.Add(newEntry);	
		} else {
			newPlayerList.Add(player);
		}		
	}
	
	var addnew : boolean = true;
	for (player in playerList){
		if (player.networkPlayer == newEntry.networkPlayer){			
			addnew = false;
			break;
		}
	}
	
	if (addnew) {
		newPlayerList.Add(newEntry);
	}
	
	if (networkPlayer == Network.player){
		playerSkin = newEntry.playerSkin;
	}
	
	playerList = newPlayerList;
	
	counterJoin = 0;
	
	for (player in playerList){
		if (player.playerSkin != ""){
			counterJoin += 1;
		}
	}
		
	Debug.Log("TellServerOurData - playerlist count: " + playerList.Count);

}

@RPC
function ApplyGlobalChatText (name : String, msg : String)
{
	var entry = new ChatEntry();
	entry.name = name;
	entry.text = msg;

	chatEntries.Add(entry);
	
	if (chatEntries.Count > 10){
		chatEntries.RemoveAt(0);
	}

	scrollPosition.y = 1000000;	
}

@RPC
function LoadMatch () {
	Debug.Log("Loading match");	
	
	//PlayerData.playerName = playerName;
	//playerSkin = playerSkin;
	
	PlayerData.inGame = true;
	
	//PlayerData.playerList = playerList;
	
	currentState = States.Playing;
	
	if (playerSkin == "") {
		PlayerData.starting = false;
	} else {
		PlayerData.starting = true;
	}
	var spaw : GameObject = GameObject.Find('spawnPoints');
	
	spaw.BroadcastMessage("LevelStart",playerSkin);
	
	counterTimer = counterTimerDefault + 5.0f;
	
}


function OnSerializeNetworkView(stream : BitStream, info : NetworkMessageInfo) {

  if (stream.isWriting) { 
    stream.Serialize(counterTimer);
  }
  else {
  	stream.Serialize(counterTimer);
  }
}
