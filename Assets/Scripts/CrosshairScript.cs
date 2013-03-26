using UnityEngine;
using System.Collections;

public class CrosshairScript : MonoBehaviour {
	
	public Texture2D crosshair;

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
	
	}
	
	void OnGUI(){
			if (networkView.isMine == true) {
				float xMin = (Screen.width / 2) - (crosshair.width / 2);
	   			float yMin = (Screen.height / 2) - (crosshair.height / 2);
	    		GUI.DrawTexture(new Rect(xMin, yMin, crosshair.width, crosshair.height), crosshair);
			}
	}
}
