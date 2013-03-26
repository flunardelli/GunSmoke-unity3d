using UnityEngine;
using System.Collections;

public class SpawnScript : MonoBehaviour {
	
	public Transform transformPlayerRed;
	
	public Transform transformPlayerBlue;
	
	public Transform transformPlayerGreen;
	
	public Transform transformPlayerYellow;
	
	public Transform transformSpectator;
	
	private int playerGroup = 0;
	
	private int spectatorGroup = 1;
	
	private string playerSkin = "";

	public GameObject[] spawnPoints;		
	
	private Object playerTransform;
	
	private GameObject randomSpawnPoint;
 
	
	public void LevelStart(string skin) {
		playerSkin = skin;
		Debug.Log("Load Match " +playerSkin);		
		if (playerSkin == "") {
			SpawntransformSpectator();
		} else {
			SpawntransformPlayer();		
		}
	}
	
	public void findSpawnPoints(string skin) {
		switch(skin) {
			case "red" :
				spawnPoints = GameObject.FindGameObjectsWithTag("SpawnPointRed");		
				break;
			case "green" :
				spawnPoints = GameObject.FindGameObjectsWithTag("SpawnPointGreen");		
				break;		
			case "blue" :
				spawnPoints = GameObject.FindGameObjectsWithTag("SpawnPointBlue");		
				break;		
			case "yellow" :
				spawnPoints = GameObject.FindGameObjectsWithTag("SpawnPointYellow");		
				break;		
		}
		randomSpawnPoint = spawnPoints[Random.Range(0, spawnPoints.Length)];
	}
	
	void Update () {		
		
	}
	
	
	void SpawntransformPlayer ()
	{

		findSpawnPoints(playerSkin);

		if (playerTransform) {		
			
			(playerTransform as Transform).transform.position = randomSpawnPoint.transform.position;
			(playerTransform as Transform).transform.rotation = randomSpawnPoint.transform.rotation;
			
		} else {
					
			switch(playerSkin) {
			case "red" :			
				playerTransform = Network.Instantiate(transformPlayerRed, randomSpawnPoint.transform.position,
			          randomSpawnPoint.transform.rotation, playerGroup);
				break;
			case "green" :			
				playerTransform = Network.Instantiate(transformPlayerGreen, randomSpawnPoint.transform.position,
			          randomSpawnPoint.transform.rotation, playerGroup);
				break;		
			case "blue" :			
				playerTransform = Network.Instantiate(transformPlayerBlue, randomSpawnPoint.transform.position,
			          randomSpawnPoint.transform.rotation, playerGroup);
				break;		
			case "yellow" :			
				playerTransform = Network.Instantiate(transformPlayerYellow, randomSpawnPoint.transform.position,
			          randomSpawnPoint.transform.rotation, playerGroup);
				break;		
	
			}
			
			
		}	
	}
	
	void DisableMotion () {
		if (playerTransform) {
			(playerTransform as Transform).GetComponent<CharacterMotor>().canControl = false;
		}
	}
	
	void EnableMotion () {
		if (playerTransform) {
			(playerTransform as Transform).GetComponent<CharacterMotor>().canControl = true;
		}
	}
	
	void SpawntransformSpectator ()
	{
		Debug.Log("SpawntransformSpectator -> ");
		if (playerTransform) {
			Debug.Log("SpawntransformSpectator -> has playerTransform");
			//Network.RemoveRPCs(networkView.viewID);
			//Network.Destroy(playerTransform);
			//Network.Destroy(networkView.viewID);
			Network.Destroy ((playerTransform as Transform).gameObject);
		}
		spawnPoints = GameObject.FindGameObjectsWithTag("Spectator");		
		
		randomSpawnPoint = spawnPoints[Random.Range(0, spawnPoints.Length)];		
		
    	playerTransform = Network.Instantiate(transformSpectator, randomSpawnPoint.transform.position,
		                    randomSpawnPoint.transform.rotation, spectatorGroup);
		
	}
	
	
	
	
	
}
