from selenium import webdriver
from facepy import GraphAPI
from json import dump
from time import sleep 

startup_fan_pages = {}
access_token = "access_token"   # get it here https://developers.facebook.com/tools/explorer/
graph = GraphAPI(access_token)

browser = webdriver.Firefox()
browser.get("http://startupsinnepal.com") # data source containing listings of startups in Nepal
sleep(40) #wait for the browser to completely load the page

startups = [startup.text.lower() for startup in browser.find_elements_by_class_name("panel-title")] #a list containing startups in nepal

for startup in startups:
    r = graph.search(startup, "page", page=False, retry=3) #page=False is to refuse to get a generator, 
    if len(r['data']) > 0:
        startup_fan_pages[r['data'][0]['name']] = str(r['data'][0]['id'])
#print(startup_fan_pages)
with open('startupsinnepalfanpages.json', 'w') as fp:
    dump(startup_fan_pages, fp)
