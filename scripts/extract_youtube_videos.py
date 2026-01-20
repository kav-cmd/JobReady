#!/usr/bin/env python3
"""
Helper script to extract video IDs from YouTube playlists
Usage: python extract_youtube_videos.py <playlist_url>
"""

import sys
import urllib.request
import json
import re

API_KEY = "AIzaSyDOaqImmRUN5R9_2bW9l3JcfNLzK2Mul40"

def extract_playlist_id(url):
    """Extract playlist ID from YouTube URL"""
    if 'list=' in url:
        return url.split('list=')[1].split('&')[0]
    return None

def get_playlist_videos(playlist_id):
    """Get all videos from a YouTube playlist using API"""
    videos = []
    next_page_token = None
    
    while True:
        url = f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId={playlist_id}&maxResults=50&key={API_KEY}"
        if next_page_token:
            url += f"&pageToken={next_page_token}"
        
        try:
            response = urllib.request.urlopen(url)
            data = json.loads(response.read())
            
            for item in data.get('items', []):
                video_id = item['snippet']['resourceId']['videoId']
                title = item['snippet']['title']
                videos.append({
                    'id': video_id,
                    'title': title
                })
            
            next_page_token = data.get('nextPageToken')
            if not next_page_token:
                break
                
        except Exception as e:
            print(f"Error: {e}")
            break
    
    return videos

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_youtube_videos.py <playlist_url>")
        sys.exit(1)
    
    playlist_url = sys.argv[1]
    playlist_id = extract_playlist_id(playlist_url)
    
    if not playlist_id:
        print("Error: Could not extract playlist ID from URL")
        sys.exit(1)
    
    print(f"Extracting videos from playlist: {playlist_id}")
    videos = get_playlist_videos(playlist_id)
    
    print(f"\nFound {len(videos)} videos:\n")
    for i, video in enumerate(videos, 1):
        print(f"  Part {i}: {video['id']} - {video['title'][:50]}")
