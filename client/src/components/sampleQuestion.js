const sampleQuestion = `
Dhawal and Aman are good chess players. One day after playing chess excessively they got bored and thought of a new game. They play this game on an infinite chess board with one king for each player. In each turn Dhawal can change the position of his king from cell (x,y) to (x-1,y) or (x,y-1). Aman can change the position of his king from (x,y) to one of cells: (x-1,y), (x-1,y-1) and (x,y-1). Both players are also allowed to skip a move. 

But there are some restrictions : A player cannot move his king to a cell with negative x-coordinate or y-coordinate or to the cell containing opponent's king. The first person to reach (0,0) wins.    

You will be given the starting coordinates of both the players and you need to find the winner. Both of them are very smart and thus play optimally well. 

They play a total of **t** games.
## <span style="color: #8060C6">CONSTRAINTS</span>
1 <= t <= 100  
0 <= x<sub>d</sub>, y<sub>d</sub>, x<sub>a</sub>, y<sub>a</sub> <= 10<sup>5</sup>

## <span style="color: #8060C6">INPUT</span>
The first line contains a single integer t - the number of games.   

The next t lines contains four integers: x<sub>d</sub>, y<sub>d</sub>, x<sub>a</sub>, y<sub>a</sub> - Dhawal's and Aman's starting coordinates in each game.   

It is guranteed that in the beginning the king's are at different coordinates and none of them is in cell (0,0).

## <span style="color: #8060C6">OUTPUT</span>
Output the name of the winner "Dhawal" or "Aman" in a new line.

## <span style="color: #8060C6">SAMPLE INPUT</span>
2   
2 1 2 2    
4 7 7 4

## <span style="color: #8060C6">SAMPLE OUTPUT</span>
Dhawal  
Aman

<!-- link: https://codeforces.com/problemset/problem/533/C -->
`
export default sampleQuestion
