using UnityEngine;
using System.Collections;

public class CameraScript : MonoBehaviour {
	
	private Camera myCamera;
	
	private Transform cameraShoulderTransform;
		
	// Use this for initialization
	void Start () 
	{	
		
		if(networkView.isMine == true)
		{
			myCamera = Camera.main;			
			cameraShoulderTransform = transform.FindChild("ShoulderCamera");
		}
		else
		{
			enabled = false;	
		}			
	}
	
	// Update is called once per frame
	void Update () 
	{
		//Make the camera follow the player's cameraShoulderTransform.
		if (cameraShoulderTransform) {
			myCamera.transform.position = cameraShoulderTransform.position;			
			myCamera.transform.rotation = cameraShoulderTransform.rotation;
		}		
	}	
	
}
