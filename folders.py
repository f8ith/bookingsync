from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive

root_folder_name = 'Dance Beat Studio Bookings'

gauth = GoogleAuth()
gauth.CommandLineAuth()

drive = GoogleDrive(gauth)

def create_folder(name):
    folder = drive.CreateFile({'title': name, 'mimeType': 'application/vnd.google-apps.folder'})
    folder.Upload()
    return folder

root_folder = drive.ListFile({'q': f"title = {root_folder_name} and 'root' in parents and trashed=false"}).GetList()
if len(root_folder) == 0: 
    root_folder = create_folder(root_folder_name)
else:
    root_folder = root_folder[0] 
    
