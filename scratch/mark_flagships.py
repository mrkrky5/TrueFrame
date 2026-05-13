import json

def mark_flagships_flexible():
    with open('data/cards.json', 'r', encoding='utf-8') as f:
        cards = json.load(f)
    
    count = 0
    for card in cards:
        # Detect flagship based on content density or specific fields
        is_deep = len(card.get('realHistory', '').split()) > 500
        has_new_fields = bool(card.get('mediaChanged')) or bool(card.get('whyItMatters'))
        
        if is_deep or has_new_fields:
            card['isFlagship'] = True
            count += 1
        else:
            card['isFlagship'] = False
            
    with open('data/cards.json', 'w', encoding='utf-8') as f:
        json.dump(cards, f, ensure_ascii=False, indent=2)
    
    print(f"Marked {count} cards as flagship based on content depth.")

if __name__ == "__main__":
    mark_flagships_flexible()
