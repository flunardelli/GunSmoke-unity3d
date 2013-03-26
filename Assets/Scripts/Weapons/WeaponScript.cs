using UnityEngine;
using System.Collections;

public class WeaponScript : MonoBehaviour {

	public Rigidbody bullet;
	public float power = 5000;
	public AudioClip colt;
	
	private Transform myCamera;
	private Transform cameraShoulderTransform;
	private Vector3 launchPosition = new Vector3();
	
	private float timer = 1.0f;

	void Start(){
		
		if(networkView.isMine == true)
		{
		
			myCamera = transform;
			
			cameraShoulderTransform = myCamera.FindChild("ShoulderCamera");
		}
		
		else
		{
			enabled = false;
		}	
		
	}
	
	// Update is called once per frame
	void Update () {		
		if (Input.GetButtonDown("Fire1") && timer >= 1.0f){	
			
			timer = 0.0f;
			
			launchPosition = cameraShoulderTransform.TransformPoint(-0.3f, -0.5f, 1.2f);
			
			networkView.RPC("SpawnBullet",RPCMode.All, launchPosition, Quaternion.Euler(cameraShoulderTransform.eulerAngles.x + 90,
			                                                    myCamera.eulerAngles.y, 0));	
			
		}	
		timer += Time.deltaTime;
	}
	
	[RPC]
	
	void SpawnBullet(Vector3 position, Quaternion rotation){
		
		Rigidbody clone = Instantiate(bullet, position, rotation) as Rigidbody;
		Vector3 fwd = transform.TransformDirection(Vector3.forward);
			clone.AddForce(fwd * power);
			audio.PlayOneShot(colt);
		Destroy(clone.gameObject, 1);
		/*
		Rigidbody instance = Instantiate(bullet, position,rotation) as Rigidbody;
			Vector3 fwd = transform.TransformDirection(Vector3.forward);
			instance.AddForce(fwd * power);
			//audio.PlayOneShot(colt);
			
			
		*/	
		
	}
		
}
