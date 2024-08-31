import boto3 
from botocore.exceptions import ClientError
from botocore.config import Config

def list_object_keys(bucket, b2):
    try:
        response = b2.Bucket(bucket).objects.all() #getting all objects in the bucket

        return_list = []               
        for object in response:        
            return_list.append(object.key) 
        return return_list             

    except ClientError as ce:
        print('error', ce)

def list_objects_browsable_url(bucket, endpoint, b2):
    try:
        bucket_object_keys = list_object_keys(bucket, b2)
        return_list = []                
        for key in bucket_object_keys:  
            url = "%s/%s/%s" % (endpoint, bucket, key) 
            return_list.append(url)     
        return return_list              # return list of urls to image in Backblaze

    except ClientError as ce:
        print('error', ce)

def get_b2_resource(endpoint, key_id, application_key):
    b2 = boto3.resource(service_name='s3',
                        endpoint_url=endpoint,                # Backblaze endpoint
                        aws_access_key_id=key_id,              # Backblaze key_id
                        aws_secret_access_key=application_key, # Backblaze application_key
                        config = Config(
                            signature_version='s3v4',
                    ))
    return b2

def get_b2_client(endpoint, key_id, application_key):
        b2_client = boto3.client(service_name='s3',
            endpoint_url=endpoint,                
            aws_access_key_id=key_id,              
            aws_secret_access_key=application_key) 
        return b2_client

def upload_file(bucket, file, b2, b2path=None):
    remote_path = b2path
    if remote_path is None:
        raise ValueError("remote_path must be specified for upload_file")
    try:
        extra_args = {'ContentType': 'image/jpeg'}        #Ensures content type is image/jpeg
        response = b2.Bucket(bucket).upload_fileobj(file, remote_path, ExtraArgs=extra_args)
    except ClientError as ce:
        print('error', ce)
        return str(ce) 

    return 'File uploaded successfully'