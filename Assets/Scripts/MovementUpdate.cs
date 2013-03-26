using UnityEngine;
using System.Collections;

/// <summary>
/// This script is attached to the player and it 
/// ensures that every players position, rotation, and scale,
/// are kept up to date across the network.
/// 
/// This script is closely based on a script written by M2H.
/// </summary>


public class MovementUpdate : MonoBehaviour {
	
	//Variables Start___________________________________
	
	private Vector3 lastPosition;
	
	private Quaternion lastRotation;
	
	private Transform myTransform;
	
	//Variables End_____________________________________
	
	// Use this for initialization
	void Start () 
	{
		if(networkView.isMine == true)
		{
			myTransform = transform;
			
			
			//Ensure taht everyone sees the player at the correct location
			//the moment they spawn.
			
			networkView.RPC("updateMovement", RPCMode.OthersBuffered,
			                myTransform.position, myTransform.rotation);
		}
		
		else
		{
			enabled = false;	
		}
	}
	
	// Update is called once per frame
	void Update () 
	{
		//If the player has moved at all then fire off an RPC to update the players
		//position and rotation across the network.
		
		if(Vector3.Distance(myTransform.position, lastPosition) >= 0.1)
		{
			//Capture the player's position before the RPC is fired off and use this
			//to determine if the player has moved in the if statement above.
			
			lastPosition = myTransform.position;
			
			networkView.RPC("updateMovement", RPCMode.OthersBuffered,
			                myTransform.position, myTransform.rotation);
		}
		
		
		if(Quaternion.Angle(myTransform.rotation, lastRotation) >= 1)
		{
			//Capture the player's rotation before the RPC is fired off and use this
			//to determine if the player has turned in the if statement above.	
			
			lastRotation = myTransform.rotation;
			
			networkView.RPC("updateMovement", RPCMode.OthersBuffered,
			                myTransform.position, myTransform.rotation);
		}
	}
	
	
	[RPC]
	void updateMovement (Vector3 newPosition, Quaternion newRotation)
	{
		transform.position = newPosition;
		
		transform.rotation = newRotation;
	}
	
	
	
	
	
	
	
	
	
	
	
	
}
