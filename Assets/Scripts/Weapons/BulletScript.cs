using UnityEngine;
using System.Collections;



public class BulletScript : MonoBehaviour {
	
	//GameObject multiplayerManager;
	// Use this for initialization

	
	void Start () {
		//multiplayerManager = GameObject.Find("MultiplayerManager");
	}
	
	// Update is called once per frame
	void Update () {
	
	}
	
	void OnTriggerEnter(Collider hit) { 
		Debug.Log("Collider hit: " + hit.gameObject.tag);
		if(hit.gameObject.tag == "ColliderRed") {
			// decreases red
			Debug.Log(" death red");
			hit.gameObject.SendMessageUpwards ("ApplyDamage","red");
			
		}
		else if(hit.gameObject.tag == "ColliderBlue") {
			// decreases blue
			Debug.Log(" death blue");
			hit.gameObject.SendMessageUpwards ("ApplyDamage","blue");
		}
		else if(hit.gameObject.tag == "ColliderGreen") {
			// decreases green
			Debug.Log(" death green");
			hit.gameObject.SendMessageUpwards ("ApplyDamage","green");
		}
		else if(hit.gameObject.tag == "ColliderYellow") {
			// decreases yellow
			Debug.Log(" death yellow");
			hit.gameObject.SendMessageUpwards ("ApplyDamage","yellow");
		}

	}
}
