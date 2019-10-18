import math
def victcheck(z):
	x = z % 3
	y = math.floor(z / 3)
	queries1 = []
	queries2 = []
	queries3 = []
	queries4 = []
	for i in range(3):
		queries1.append([ (x-2+i,y) , (x-1+i, y) , (x+i,y) ]) # Horizontal
		queries2.append([ (x,y-2+i) , (x, y-1+i) , (x,y+i) ]) # Vertical
		queries3.append([ (x-2+i,y-2+i) , (x-1+i, y-1+i) , (x+i,y+i) ]) # Diagonal x = -y
		queries4.append([ (x-2+i,y+2-i) , (x-1+i, y+1-i) , (x+i,y-i) ]) # Diagonal x = y

	horizontal = filter(queries1)
	vertical = filter(queries2)
	dia1 = filter(queries3)
	dia2 = filter(queries4)
	idh = idconvert(horizontal)
	idv = idconvert(vertical)
	idd1 = idconvert(dia1)
	idd2 = idconvert(dia2)
	print(idh,idv,idd1,idd2)

def filter(queries):
	discard_indices = []
	for ii in range(len(queries)):
		query = queries[ii]
		flag = 1
		for query1 in query:
			if query1[0] < 0 or query1[1] < 0 or query1[0] > 2 or query1[1] > 2:
				flag = 0
				break
		if flag == 0:
			discard_indices.append(ii)

	for ii in range(len(discard_indices) - 1, -1, -1):
		index = discard_indices[ii]
		queries.pop(index)
	return queries

def idconvert(queries):
	gridid = []
	for query in queries:
		for query1 in query:
			gridid.append(query1[0] + query1[1]*3)
	return gridid

victcheck(0)