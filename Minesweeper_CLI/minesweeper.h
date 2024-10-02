/*
    * Aknakereső - függvények és osztályok deklarációi
    * Balogh Efraim
    * 2023. 04. 09.
*/

#ifndef __MINESWEEPER_H__
#define __MINESWEEPER_H__

// színek a pálya megjelenítéséhez
#define RESET             "\033[0m"
#define fgGRAY            "\033[1;30m"
#define bgGRAY            "\033[1;30;47m"
#define fgBLUE            "\033[0;34m"
#define fgGREEN           "\033[0;32m"
#define fgRED             "\033[1;31m"
#define fg_lightBLUE      "\033[1;34m"
#define fgPINK            "\033[0;35m"
#define fgCYAN            "\033[0;36m"
#define fg_lightGRAY      "\033[0;37m"
#define fgYELLOW          "\033[0;33m"
#define bgRED_fgBLACK     "\033[0;30;41m"
#define bgYELLOW_fgBLACK  "\033[7;49;33m"

// felhasznált könyvtárak és header fájlok
#include <iostream>
#include <cstdlib>
#include <ctime>
#include <unistd.h>
#include "sparse_matrix.h"

using namespace std;

void init_rand();

void clear();

class Cell {
public:
    bool is_open;
    bool is_mine;
    bool is_flagged;
    int neighbours;

    Cell();
};

class Minefield {
    Cell **cells;
    sparse_matrix board;

public:
    Minefield(int, int, int);

    ~Minefield();

    void generate_field();

    void print();

    void print_cell(int, int);

    int interact_with_cell(int, int, char);

    int open_cell(int, int);

    void flag_cell(int, int);

    bool check_bounds(int, int);

    void open_zeroes(int, int);

    int open_neighbours(int, int);

    void open_mines();

    void open_all();

    int check_win();

    int neighbour_mines(int, int);
};

#endif