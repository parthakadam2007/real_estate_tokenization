dummy block chain using python 

import random
import string
import hashlib
import json
import datetime
import pandas as pd
import tkinter as tk
from tkinter import ttk, messagebox
import os

def generate_combination():
    # First two characters: random alphabets (uppercase or lowercase)
    first_two = ''.join(random.choice(string.ascii_letters) for _ in range(2))

    # Next two characters: random digits
    next_two = ''.join(random.choice(string.digits) for _ in range(2))

    # Last two characters: uppercase/lowercase alphabets or digits
    last_two = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(2))

    return first_two + next_two + last_two

def generate_multiple_combinations(count):
    combinations = set()
    while len(combinations) < count:
        combinations.add(generate_combination())
    return list(combinations)

class Block:
    def __init__(self, index, previous_hash, data, timestamp):
        self.index = index
        self.previous_hash = previous_hash
        self.data = data
        self.timestamp = timestamp
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        block_string = json.dumps(self.__dict__, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

class Blockchain:
    def __init__(self):
        self.chain = [self.create_genesis_block()]
        self.ledger = {}
        self.excel_file = "property_ledger.xlsx"
        self.load_ledger_from_excel()

    def create_genesis_block(self):
        return Block(0, "0", "Genesis Block", datetime.datetime.now().isoformat())

    def get_latest_block(self):
        return self.chain[-1]

    def add_block(self, data):
        latest_block = self.get_latest_block()
        new_block = Block(len(self.chain), latest_block.hash, data, datetime.datetime.now().isoformat())
        self.chain.append(new_block)

    def add_transaction(self, property_id, seller, buyer, price, share_percentage):
        if property_id not in self.ledger:
            self.ledger[property_id] = {}

        # Update seller's share
        if seller in self.ledger[property_id]:
            self.ledger[property_id][seller] -= share_percentage
            if self.ledger[property_id][seller] <= 0:
                del self.ledger[property_id][seller]

        # Update buyer's share
        if buyer in self.ledger[property_id]:
            self.ledger[property_id][buyer] = self.ledger[property_id].get(buyer, 0) + share_percentage

        transaction = {
            "seller": seller,
            "buyer": buyer,
            "price": price,
            "share_percentage": share_percentage,
            "timestamp": datetime.datetime.now().isoformat()
        }
        self.add_block({"property_id": property_id, "transaction": transaction})
        self.save_ledger_to_excel()

    def get_property_history(self, property_id):
        return self.ledger.get(property_id, {})

    def load_ledger_from_excel(self):
        if os.path.exists(self.excel_file):
            df = pd.read_excel(self.excel_file, sheet_name="Ownership Ledger")
            for _, row in df.iterrows():
                property_id = row["Property ID"]
                owner = row["Owner"]
                share = row["Share Percentage"]
                if property_id not in self.ledger:
                    self.ledger[property_id] = {}
                self.ledger[property_id][owner] = share

    def save_ledger_to_excel(self):
        rows = []
        for property_id, owners in self.ledger.items():
            for owner, share in owners.items():
                rows.append({"Property ID": property_id, "Owner": owner, "Share Percentage": share})

        df = pd.DataFrame(rows)
        with pd.ExcelWriter(self.excel_file, engine="openpyxl") as writer:
            df.to_excel(writer, sheet_name="Ownership Ledger", index=False)

class BlockchainApp:
    def __init__(self, root):
        self.blockchain = Blockchain()
        self.properties = generate_multiple_combinations(5)
        self.root = root
        self.root.title("Property Blockchain System")

        self.create_widgets()

    def create_widgets(self):
        # Menu Buttons
        ttk.Button(self.root, text="List Properties", command=self.list_properties).grid(row=0, column=0, padx=10, pady=10)
        ttk.Button(self.root, text="Add Transaction", command=self.add_transaction).grid(row=0, column=1, padx=10, pady=10)
        ttk.Button(self.root, text="View Property History", command=self.view_property_history).grid(row=0, column=2, padx=10, pady=10)
        ttk.Button(self.root, text="View Blockchain", command=self.view_blockchain).grid(row=0, column=3, padx=10, pady=10)
        ttk.Button(self.root, text="List Property Owners", command=self.list_property_owners).grid(row=0, column=4, padx=10, pady=10)

        # Text Area
        self.text_area = tk.Text(self.root, wrap=tk.WORD, width=80, height=20)
        self.text_area.grid(row=1, column=0, columnspan=5, padx=10, pady=10)

    def list_properties(self):
        self.text_area.delete(1.0, tk.END)
        self.text_area.insert(tk.END, "Properties:\n")
        for i, prop in enumerate(self.properties):
            self.text_area.insert(tk.END, f"{i + 1}. {prop}\n")

    def add_transaction(self):
        def submit_transaction():
            property_id = property_id_entry.get()
            seller = seller_entry.get()
            buyer = buyer_entry.get()
            try:
                price = float(price_entry.get())
                share_percentage = float(share_entry.get())
            except ValueError:
                messagebox.showerror("Error", "Invalid input. Please enter numeric values for price and share percentage.")
                return

            if property_id not in self.properties:
                messagebox.showerror("Error", "Invalid Property ID.")
                return

            if share_percentage <= 0 or share_percentage > 100:
                messagebox.showerror("Error", "Share percentage must be between 0 and 100.")
                return

            self.blockchain.add_transaction(property_id, seller, buyer, price, share_percentage)
            messagebox.showinfo("Success", "Transaction added successfully!")
            transaction_window.destroy()

        transaction_window = tk.Toplevel(self.root)
        transaction_window.title("Add Transaction")

        tk.Label(transaction_window, text="Property ID:").grid(row=0, column=0, padx=10, pady=5)
        property_id_entry = ttk.Entry(transaction_window)
        property_id_entry.grid(row=0, column=1, padx=10, pady=5)

        tk.Label(transaction_window, text="Seller:").grid(row=1, column=0, padx=10, pady=5)
        seller_entry = ttk.Entry(transaction_window)
        seller_entry.grid(row=1, column=1, padx=10, pady=5)

        tk.Label(transaction_window, text="Buyer:").grid(row=2, column=0, padx=10, pady=5)
        buyer_entry = ttk.Entry(transaction_window)
        buyer_entry.grid(row=2, column=1, padx=10, pady=5)

        tk.Label(transaction_window, text="Price:").grid(row=3, column=0, padx=10, pady=5)
        price_entry = ttk.Entry(transaction_window)
        price_entry.grid(row=3, column=1, padx=10, pady=5)

        tk.Label(transaction_window, text="Share Percentage:").grid(row=4, column=0, padx=10, pady=5)
        share_entry = ttk.Entry(transaction_window)
        share_entry.grid(row=4, column=1, padx=10, pady=5)

        ttk.Button(transaction_window, text="Submit", command=submit_transaction).grid(row=5, column=0, columnspan=2, pady=10)

    def view_property_history(self):
        def submit_view():
            property_id = property_id_entry.get()
            history = self.blockchain.get_property_history(property_id)
            self.text_area.delete(1.0, tk.END)
            if not history:
                self.text_area.insert(tk.END, "No transactions found for this property.\n")
            else:
                self.text_area.insert(tk.END, f"Ownership for {property_id}:\n")
                for owner, share in history.items():
                    self.text_area.insert(tk.END, f"- {owner}: {share}%\n")
            history_window.destroy()

        history_window = tk.Toplevel(self.root)
        history_window.title("View Property History")

        tk.Label(history_window, text="Property ID:").grid(row=0, column=0, padx=10, pady=5)
        property_id_entry = ttk.Entry(history_window)
        property_id_entry.grid(row=0, column=1, padx=10, pady=5)

        ttk.Button(history_window, text="Submit", command=submit_view).grid(row=1, column=0, columnspan=2, pady=10)

    def view_blockchain(self):
        self.text_area.delete(1.0, tk.END)
        self.text_area.insert(tk.END, "Blockchain:\n")
        for block in self.blockchain.chain:
            self.text_area.insert(tk.END, json.dumps(block.__dict__, indent=4) + "\n")

    def list_property_owners(self):
        self.text_area.delete(1.0, tk.END)
        self.text_area.insert(tk.END, "Property Owners:\n")
        for property_id, owners in self.blockchain.ledger.items():
            self.text_area.insert(tk.END, f"Property ID: {property_id}\n")
            for owner, share in owners.items():
                self.text_area.insert(tk.END, f"  - {owner}: {share}%\n")

if __name__ == "__main__":
    root = tk.Tk()
    app = BlockchainApp(root)
    root.mainloop()
