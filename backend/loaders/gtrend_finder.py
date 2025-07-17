from pytrends.request import TrendReq

pytrends = TrendReq()

def get_search_trends(brand):
    print(f"Searching: {brand}")
    results = {}
    brand_list = [brand]
    pytrends.build_payload(brand_list, timeframe='today 12-m')

    data = pytrends.interest_over_time()

    if 'isPartial' in data.columns:
        data = data.drop(columns=['isPartial'])

    results['search_interest'] = {k.strftime('%Y-%m'): v for k, v in data.resample('M').mean()[brand].to_dict().items()}

    region_data = pytrends.interest_by_region()
    results['expansion_markets'] = region_data[region_data[brand] > 0][brand].to_dict()

    return results