from pytrends.request import TrendReq

pytrends = TrendReq()

def get_search_trends(brand):
    results = {}
    brand_list = [brand]
    pytrends.build_payload(brand_list, timeframe='today 12-m')

    data = pytrends.interest_over_time()

    if 'isPartial' in data.columns:
        data = data.drop(columns=['isPartial'])

    results['search_interest'] = data.resample('M').mean()
    results['expansion_markets'] = pytrends.interest_by_region().query(f"{brand} > 0")

    return results

# print(get_search_trends("Starbucks"))