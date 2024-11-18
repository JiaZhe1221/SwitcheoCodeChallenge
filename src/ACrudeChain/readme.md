# Consensus-Breaking Change in Blockchain

## What is Consensus?
Consensus in blockchain means the idea that every computer (or node) in the network shares the same information about the blockchain. It's important that all nodes always view the same version of the blockchain so that everyone can trust the data.

## What Does Breaking Consensus Mean?
When the nodes disagree on the current state of the blockchain due to a change in the data or rules, this known as breaking consensus. This may result in:
- **Blockchain Fork**: When some nodes follow one version of the blockchain, and others follow a different version.
- **Invalid Blocks**: Due to the change, some blocks may not be able to be added to the blockchain.
- **Changes to How Data Is Processed**: If the way the blockchain handles data is changed, some nodes may interpret the data differently.

In conclusion, breaking consensus means that the nodes can’t agree on the blockchain’s state anymore, which can cause a **fork** or **problems** with the data.

## Change That Breaks Consensus
### What’s the Change?
The change was made in the `blog` module, where the `author` field in the `Post` object was changed from a `string` to a `bytes` type. This change was made to store the author’s info more efficiently.

### Why This Breaks Consensus
This change messes up consensus because:
1. **Old Nodes Won’t Work**: Nodes that are still running the old version expect the `author` field to be a `string`. If they see `author` as a `bytes` type, they won’t understand it, and it will cause errors when trying to validate it.
2. **Blockchain Fork**: If some nodes update to the new version, and others don’t, the blockchain will split into two versions. The nodes that updated will see one version of the blockchain, and the old ones will see another, which causes a fork.
3. **Different Rules for Processing**: Because the `Post` logic is now changed, nodes with the old version will treat data differently than those running the new version. This makes the blockchain state different for each node.

### What Happens
- **Network Split**: The blockchain will split into two branches, and some nodes will be out of sync.
- **Validator Problems**: Nodes that are running the old version of the protocol won’t be able to validate blocks from the new version, causing issues.
- **Inconsistent State**: Some nodes might think the blockchain is in one state, while others think it’s in another state, causing confusion.