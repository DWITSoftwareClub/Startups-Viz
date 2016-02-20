import json
import gspread
from oauth2client.client import SignedJwtAssertionCredentials
from facepy import GraphAPI
from json import load

previous_total_likes = 0
json_key = json.load(open('StartUpViz-5e0b6bb6f4e5.json'))
scope = ['https://spreadsheets.google.com/feeds']

credentials = SignedJwtAssertionCredentials(json_key['client_email'], json_key['private_key'].encode(), scope)


gc = gspread.authorize(credentials)

wks = gc.open("StartUp")
with open('startupsfanpages.json') as json_data:
   startups = load(json_data)

print startups
graph = GraphAPI("access_token")
for fanpage, fanpageid in startups.iteritems():

    #worksheet = gc.add_worksheet(title= fanpage, rows="1000", cols="20")
    worksheet = wks.add_worksheet(title= fanpage, rows="1", cols="7")
    worksheet.update_cell(1, 1, 'date')
    worksheet.update_cell(1, 2, 'likes')
    worksheet.update_cell(1, 3, 'country')
    worksheet.update_cell(1, 4, 'countrylikes')
    worksheet.update_cell(1, 5, 'growth')

    print fanpageid
    data = graph.get(str(fanpageid) + '/insights/page_fans_country/lifetime?since=2016-01-01&until=2016-01-28', page=False)
    print data
    for keys in data['data']:
        print keys
        for daily_record in keys['values']:
            print daily_record
            sum = 0 
            if(len(daily_record['value']) > 0):
                current_date = daily_record['end_time'].split('T')[0]
            
                for country in daily_record['value']:
                    sum += daily_record['value'][country]
                print current_date, sum
                growth = sum - previous_total_likes
                worksheet.append_row([current_date, sum, '', '', growth])
                previous_total_likes = sum
            else:
                print "inside else something is wrong"
                continue
        
#graph = GraphAPI("")
#group_id = '153080620724'
#data = graph.get(group_id + '/insights/page_fans_country/lifetime?since=2014-01-01&until=2014-01-6', page=False)
#for keys in data['data']:
 #   for daily_record in keys['values']:
  #      sum = 0
   #     if (len(daily_record['value'])!=0):
    #        print daily_record['end_time'].split('T')[0]
     #       print "###"
      #      for country in daily_record['value']:
       #         print country, daily_record['value'][country]
        #        sum += daily_record['value'][country]
         #   print "Sum", sum
        #else:
         #   continue
