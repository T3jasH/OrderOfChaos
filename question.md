# Salutes

Everytime the employees of CodeShop pass each other in the hall, each of them must stop and salute each other one at a time before resuming their path. A salute is five seconds long, so each exchange of salute takes a full of 10 seconds. The manager thinks that by removing the salute requirement, he could save several collective hours of employee time per day. But first he wants to know how many salutes are happening exactly.Given a string of salutes your job is to find the number of of salutes happening during a typical walk.

## Explanation

`-->--><--`

Each hallway string will contain 3 different types of characters: ">", an employee walking to the right; "<", an employee walking to the left; and "-", an empty space. Every employee walks at the same speed either to the right or to the left, according to the direction. Whenever two employees cross each other they salute each other and then continue walking. In the above example total number of salutes is 4.

## Input Format

The first line contains **_T_**, the number of testcases.  
The first and the only line of every testcase contains the string of hallway

## Output Format

For each testcase output the number of salutes, as the number of salutes can be huge, output **_salute%10<sup>9</sup>_**.

## Sample Input

```
1
-->--><--
```

## Sample Output

```
4
```

## TESTCASE

```
2
--->-><-><-->-
--->-><-><-->-
```

## Answer

10
10
