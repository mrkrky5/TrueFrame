import json
from collections import Counter

def analyze():
    with open('data/cards.json', 'r', encoding='utf-8') as f:
        cards = json.load(f)
    
    media_titles = [c.get('mediaTitle', 'Unknown') for c in cards]
    counts = Counter(media_titles)
    
    results = {
        "total_cards": len(cards),
        "total_unique_media": len(counts),
        "most_common": counts.most_common(20)
    }
    
    with open('scratch/media_stats.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    analyze()
