from selenium import webdriver
from facepy import GraphAPI
import json
import time 

startup_fan_pages = {}


access_token = "CAACEdEose0cBAMRSYnOgvGS19ZAmraBuyVQ6lkrqnSJtyKD1oozQFeCYXvIc6IejhPEYRSQ3tptX3ZAhhiHgZCZA8OuBir51mzocHXBO1kpBgcTYHg1moSMwMc1kjy8abfZA3ZCGnpYtpoOyx0mmaruhzVCRi3w6t5KwXN2XIWxCA9h729ZBXmlza2KsNjCaDDeMsssqdaBHSYyn4AwUUqY"   # get it here https://developers.facebook.com/tools/explorer/

graph = GraphAPI(access_token)

browser = webdriver.Firefox()
browser.get("http://startupsinnepal.com")

time.sleep(40) #wait for the browser to completely load the page


startups = browser.find_elements_by_class_name("panel-title") #returns a list of objects having class="panel-title"
print("startups found")

for startup in startups:
    #print(startup.text)
    r = graph.search(startup.text.lower(), "page", page=False, retry=3) #page=False is to refuse to get a generator, 
    if len(r['data']) > 0:
        startup_fan_pages[r['data'][0]['name']] = str(r['data'][0]['id'])

#print(startup_fan_pages)
print(startup_fan_pages)
with open('startupsinnepalfanpages.json', 'w') as fp:
    json.dump(startup_fan_pages, fp)
