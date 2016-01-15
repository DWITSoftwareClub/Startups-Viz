from facepy import GraphAPI
graph = GraphAPI("")
group_id = '153080620724'
data = graph.get(group_id + '/insights/page_fans_country/lifetime?since=2014-01-01&until=2014-01-6', page=False)
for keys in data['data']:
    for daily_record in keys['values']:
        sum = 0
        if (len(daily_record['value'])!=0):
            print daily_record['end_time'].split('T')[0]
            print "###"
            for country in daily_record['value']:
                print country, daily_record['value'][country]
                sum += daily_record['value'][country]
            print "Sum", sum
        else:
            continue