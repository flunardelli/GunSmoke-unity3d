
public var playerLife : int;
//public var maxLife : int = 3;

public var lifeTexture : Texture2D;

public var playerSkin : String;

public var playerName : String;
public var playerList = new ArrayList();

var main : Game;
//var showEndGame : boolean = false; 
var spawnPoints : GameObject;

var labelStyle : GUIStyle;
//var timer : String;

public var counterTimerDisplay : String;

public var isPlayer : boolean = false;
public var isSpectator : boolean = false;


function Start () {
	//currentLife = 3;
	main = GameObject.Find("Main").GetComponent(Game);
	
	playerSkin = main.playerSkin;
	playerName = main.playerName;
	playerList = main.playerList;
	
	Debug.Log("player list " + playerList.Count);
	
	
	
	playerLife = main.playerLife;
	
	Debug.Log("main.playerLife: "+ playerLife +" PlayerData.starting: "+PlayerData.starting);
	
	spawnPoints = GameObject.Find('spawnPoints');
	counterTimerDisplay = "";
	labelStyle = main.labelStyle;
	
	if (PlayerData.starting) { 
		spawnPoints.BroadcastMessage("DisableMotion");
		
		main.infoMessage = "Starting game";
		main.counterInfoMessage = 3.0f;
		yield WaitForSeconds(3);
		main.infoMessage = "Go!!!";
		main.counterInfoMessage = 2.0f;
		yield WaitForSeconds(2);
		
		spawnPoints.BroadcastMessage("EnableMotion");
		PlayerData.starting = false;
	}
	
}

function Update () {
	var minutes : int =  ((Mathf.CeilToInt(main.counterTimer)) / 60);
	var seconds : int = ((Mathf.CeilToInt(main.counterTimer)) % 60);
	counterTimerDisplay = String.Format ("{0:00}:{1:00}", minutes, seconds);
	
	checkWinner();
	
	//Debug.Log("currentState: " +main.currentState + " " +main.infoMessage + " " +main.counterInfoMessage);
	
}

function OnGUI() {
	GUILayout.BeginHorizontal();
	/*if (Network.peerType == NetworkPeerType.Client) {
		GUILayout.Label("Client");
	} else if (Network.peerType == NetworkPeerType.Server) {
		GUILayout.Label("Server");
	}*/

	
	if (networkView.isMine == true) {
		
		var i : int;
			
		GUILayout.BeginArea (Rect (0,0,Screen.width,Screen.height));
			GUILayout.BeginHorizontal();
				for (var d : PlayerNode in playerList){
					if (d.playerSkin != "") {
				
						switch(d.playerSkin) {
							case 'red':
								GUI.color = Color.red;								
							break;
							case 'green':
								GUI.color = Color.green;								
							break;
							case 'blue':
								GUI.color = Color.blue;								
							break;
							case 'yellow':
								GUI.color = Color.yellow;								
							break;
						}				
						GUILayout.BeginVertical();
							GUILayout.BeginHorizontal();
								for (i = 0; i < d.playerLife; i++ ){
									GUILayout.Label(lifeTexture, GUILayout.Width(50), GUILayout.Height(50));
								}
							GUILayout.EndHorizontal();
							GUILayout.Label(d.playerName);														
						GUILayout.EndVertical();
						GUILayout.FlexibleSpace();
					}
				}

			GUILayout.EndHorizontal();
		
		GUILayout.EndArea();

	 
	
	GUILayout.EndHorizontal(); 

	
		labelStyle.fontSize = 48;
		labelStyle.normal.textColor = Color.white;
		GUI.color = Color.white;
		GUILayout.BeginArea (Rect (0,0,Screen.width,Screen.height));
		GUILayout.Space (100);
		
		GUILayout.BeginHorizontal();
		GUILayout.FlexibleSpace();
		
			GUILayout.BeginVertical();
			//GUILayout.FlexibleSpace();
						
				if (main.counterInfoMessage > 0) {
					GUILayout.BeginHorizontal();
					GUILayout.FlexibleSpace();
						GUILayout.Label(main.infoMessage,labelStyle);
					GUILayout.FlexibleSpace();
					GUILayout.EndHorizontal();
					
					GUILayout.Space (20);
					
					main.counterInfoMessage -= Time.deltaTime;
					
					if (main.currentState == States.Score) {
						
						GUILayout.BeginHorizontal();
							GUILayout.FlexibleSpace();
							
							if (GUILayout.Button("New Game",GUILayout.Width(161), GUILayout.Height(50))) {
								//main.currentState = States.Main;
								//Application.LoadLevel("Main");
								Network.Disconnect();
								
							}	
							
							if (GUILayout.Button("Quit", GUILayout.Width(161), GUILayout.Height(50))) {
								main.Quit();
							}
							
							GUILayout.FlexibleSpace();
						GUILayout.EndHorizontal();
					}
					
				} else if (main.counterTimer <= main.counterTimerDefault && main.currentState == States.Playing){
					GUILayout.Label("Time: " + counterTimerDisplay,labelStyle); 
				}
				GUILayout.FlexibleSpace();
				GUILayout.EndVertical();				
			GUILayout.FlexibleSpace();
		GUILayout.EndHorizontal();
		GUILayout.EndArea ();
	}
}

@RPC
function TellPlayerLife (skin : String, info : NetworkMessageInfo) {
	Debug.Log("TellPlayerLife -> sender " + info.sender.ToString() + " --- > id skin -> " + skin); 
	
	
	for (var d : PlayerNode in playerList){		
		if (d.playerSkin == skin) {
			d.playerLife -= 1;
			if (d.playerSkin == playerSkin) {
				playerLife = d.playerLife;
				if (playerLife <= 0) {
					//d.playerSkin = "";
					//playeSkin = "";
					//PlayerSpectator(skin);
					//networkView.RPC("PlayerSpectator", RPCMode.All,skin, playerName);
					isSpectator = true;
					yield WaitForSeconds(2);
					PlayerSpectator(skin);
				} else {
					PlayerRespawn(skin);
				}	
			}
			if (d.playerLife <= 0) {
				d.playerSkin = "";
			}
			Debug.Log("TellPlayerLife - skin:" + skin + " -> life:"+d.playerLife);
			break;
		}			
	}	
}

function ApplyDamage(skin : String) {
	if (networkView.isMine == true) {
		//if (playerLife >= 1) {
			//playerLife -= 1;
			networkView.RPC("TellPlayerLife", RPCMode.AllBuffered,skin);
		//}					
	}
}
@RPC
function EndGame (winner : String) {
	//if (main.currentState == States.score) {	
		main.currentState = States.Score;
		Debug.Log("End game");
		if (winner != "") {
			main.infoMessage = "Winner is: " + winner;
			main.counterInfoMessage = 600.0f;
		} else {
			main.infoMessage = "Draw game";
			main.counterInfoMessage = 600.0f;
		}
		//showEndGame = true;
		//yield WaitForSeconds(3);
		//PlayerData.playerSkin = "";	
		//spawnPoints.BroadcastMessage("LevelStart","");
		spawnPoints.BroadcastMessage("DisableMotion");
	//}
}

@RPC
function PlayerRespawn (skin : String) {
	if (skin == playerSkin) {
		spawnPoints.BroadcastMessage("LevelStart",skin);
		main.infoMessage = "Respawn";
		main.counterInfoMessage = 5.0f;
	}
}

//@RPC
function PlayerSpectator (skin : String) {
	//if (skin == playerSkin) {	
		//PlayerData.playerSkin = "";	
		spawnPoints.BroadcastMessage("LevelStart","");
		main.infoMessage = "Eliminated";
		main.counterInfoMessage = 10.0f;
	//}
}

function checkWinner() {
	if (main.currentState != States.Score) {
		var winnerLife : int = 0;
		var winnerName : String = "";
		var numPlayers : int = 0;
		
		for (var d : PlayerNode in playerList){	
			Debug.Log("checkWinner n:" + d.playerName + "  s:"+d.playerSkin+ " l:"+d.playerLife);	
			if (d.playerSkin != "") {		
					
				numPlayers += 1;				
				if (d.playerLife > winnerLife) {
					winnerName = d.playerName;
					winnerLife = d.playerLife;
				}
				
			}
		}
		if (main.counterTimer <= 0 || numPlayers <= 1) {
			if (numPlayers > 1) {
				winnerName = "";
			}
			//networkView.RPC("EndGame", RPCMode.All, winnerName);
			EndGame(winnerName);
		}
	}
}