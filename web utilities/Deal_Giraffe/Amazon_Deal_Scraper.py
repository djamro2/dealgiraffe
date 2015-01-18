'''
Created on Jan 16, 2015

@author: Dan
'''

# from my super limited understanding of BeautifulSoup, 
# the soup.find_all( "       ", {"         ": "       "}) looks as follows
#                    |Thing right after the '<' 
#                                |something before an equals sign
#                                              |something after the equals sign (what we're setting the last value equal to) 
# Example: g_data = soup.find_all("div", {"class": "info"})
#
# random helpful thing: time.time() gives us the current time in seconds

import requests
import time
import sys
import threading
from bs4 import BeautifulSoup

class Amazon_Deal_Scraper():
        
    def __init__(self, imgsrc, url, tag_url):
        self.imgsrc = imgsrc
        self.url = url
        self.tag_url = tag_url
        self.r = requests.get(url)
        self.soup = BeautifulSoup(self.r.content)
        
    def getTitle(self):
        title = self.soup.find_all("span", {"id": "productTitle"})
        for t in title:
            print("Title: " + t.text)
            return t.text
    
    def getListPrice(self):
        listPrice = self.soup.find_all("td", {"class": "a-span12 a-color-secondary a-size-base a-text-strike"})
        for lp in listPrice:
            print("List Price: " + lp.text)
            return lp.text
            
    def getCurrentPrice(self):
        currentPrice = self.soup.find_all("span", {"id": "priceblock_ourprice"})
        for cp in currentPrice:
            print("Current Price: " + cp.text)
            return cp.text
        salePrice = self.soup.find_all("span", {"id": "priceblock_saleprice"})
        for sp in salePrice:
            print("Sale Price: " + sp.text)
            return sp.text
            
    def getImgSrc(self):
        return self.imgsrc
        
    def getDesc(self):
        descriptions = self.soup.find_all("fgfgfspan", {"class": "a-list-item"})
        for desc in descriptions:
            print("Description: " + desc.text)
        return descriptions 
        
    def getTagUrl(self):
        return self.tag_url
        
    
ads = Amazon_Deal_Scraper("http://ecx.images-amazon.com/images/I/51lSB7Xo9sL._SL1200_.jpg",
                       "http://www.amazon.com/EC-Technology%C2%AE-22400mAh-Capacity-Flashlight/dp/B00FDK2G2C/ref=sr_1_1?s=wireless&ie=UTF8&qid=1421443941&sr=1-1&keywords=EC+Technology%C2%AE+2nd+Gen+Deluxe+22400mAh+Ultra+High+Capacity+3+USB+Output+External+Battery+With+3-modes+LED+Flashlight+Portable+Power+Bank+Charger+For+iPhone+6+Plus+5S+5C+5+4S+4%2C+iPad+Air%2C+iPad+mini%2C+Galaxy+S5+S4+S3%2C+Note+4+3%2C+Nexus%2C+HTC+One%2C+Most+other+Phones+and+Tablets+-+Black+%26+Red&pebp=1421443944832&peasin=B00FDK2G2C",
                       "http://www.amazon.com/gp/product/B00OKICBC8/ref=as_li_tl?ie=UTF8&camp=1789&creative=390957&creativeASIN=B00OKICBC8&linkCode=as2&tag=dealgira-20&linkId=WO5YHEHSKUTOGR7T")
        
ads.getTitle()
ads.getListPrice()
ads.getCurrentPrice()
ads.getDesc()
        