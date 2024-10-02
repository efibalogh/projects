/*
    * Aknakereső - függvények és osztályok definíciói
    * Balogh Efraim
    * 2023. 04. 09.
*/

#include "minesweeper.h"

using namespace std;

/*
    * A véletlenszám generátor inicializálása.
*/
void init_rand() {
    srand(time(NULL));
}

/*
    * A konzol törlése.
*/
void clear() {
    #if defined(__linux__) || defined(__unix__) || defined(__APPLE__)
        system("clear");
    #endif

    #if defined(_WIN32) || defined(_WIN64)
        system("cls");
    #endif
}

/*
    * A Cell osztály konstruktora.
*/
Cell::Cell() {
    neighbours = 0;
    is_mine = false;
    is_open = false;
    is_flagged = false;
}

/*
    * A Minefield osztály konstruktora.
*/
Minefield::Minefield(int rows, int cols, int mines) {
    board = sparse_matrix(rows, cols, mines);
    cells = new Cell *[rows];

    for (int i = 0; i < rows; i++)
        cells[i] = new Cell [cols];
}

/*
    * A Minefield osztály destruktora.
*/
Minefield::~Minefield() {
    int rows = board.get_rowsize();

    for (int i = 0; i < rows; i++)
        delete [] cells[i];

    cells = NULL;
    delete [] cells;
}

/*
    * Aknák generálása a pályán és a szomszédos cellák számának meghatározása.
*/
void Minefield::generate_field() {
    int rows = board.get_rowsize();
    int cols = board.get_colsize();
    int mines = board.get_nonzero();

    while (mines >= 0) {
        int r, c;
        r = rand() % rows;
        c = rand() % cols;
        board.set_value(r, c, 1);
        cells[r][c].is_mine = true;
        mines--;
    }

    for (int i = 0; i < rows; i++)
        for (int j = 0; j < cols; j++)
            cells[i][j].neighbours = neighbour_mines(i, j);
}

/*
    * A pálya megjelenítése.
*/
void Minefield::print() {
    cout << " y |";

    for (int i = 0; i < board.get_colsize(); i++) {
        if (i < 10)
            cout << " " << i << " ";
        else
            cout << i << " ";
    }

    cout << "\n ";

    for (int i = 0; i <= board.get_colsize(); i++)
        cout << "---";

    cout << "\n x |\n";

    for (int i = 0; i < board.get_rowsize(); i++) {
        for (int j = 0; j < board.get_colsize(); j++) {
            if (j == 0) {
                if (i < 10)
                    cout << " " << i << " |";
                else
                    cout << i << " |";
            }

            print_cell(i, j);
        }

        cout << "\n";
    }
}

/*
    * Egy cella megjelenítése különböző színekben.
    * row - a cella sorindexe
    * col - a cella oszlopindexe
*/
void Minefield::print_cell(int row, int col) {
    // ha a cella jelölve van
    if (cells[row][col].is_flagged) {
        cout << bgYELLOW_fgBLACK << " F " << RESET;

        return;
    }

    if (cells[row][col].is_open) {
        // ha a cella akna
        if (cells[row][col].is_mine) {
            cout << bgRED_fgBLACK << " M " << RESET;
            
            return;
        }
        
        // ha nincs szomszédos akna
        if (cells[row][col].neighbours == 0) {
            cout << fgGRAY << " - " << RESET;

            return;
        }

        // a szomszédos aknák száma alapján kell színezni a cellát
        switch (cells[row][col].neighbours) {
            case 1:
                cout << fgBLUE;
                break;
            case 2:
                cout << fgGREEN;
                break;
            case 3:
                cout << fgRED;
                break;
            case 4:
                cout << fg_lightBLUE;
                break;
            case 5:
                cout << fgPINK;
                break;
            case 6:
                cout << fgCYAN;
                break;
            case 7:
                cout << fgYELLOW;
                break;
            case 8:
                cout << fg_lightGRAY;
                break;
        }

        // ha egy számot kell kiírni
        cout << " " << cells[row][col].neighbours << " " << RESET;

        return;
    }
    
    // ha nincs nyitva a cella
    cout << bgGRAY << " ? " << RESET;
}

/*
    * Egy cella kinyitása vagy jelölése.
    * row - a cella sorindexe
    * col - a cella oszlopindexe
    * action - a végrehajtandó művelet (kinyitás vagy jelölés)
    * visszatérítési érték: 0 - a cella nem akna vagy be van jelölve, 1 - a cella akna
*/
int Minefield::interact_with_cell(int row, int col, char action) {
    if (action == 'o' || action == 'O')
        return open_cell(row, col);
    else if (action == 'f' || action == 'F')
        flag_cell(row, col);

    return 0;
}

/*
    * Egy cella kinyitása. Ha a cella értéke 0, akkor a szomszédos cellák (0 értékűek) is kinyílnak.
    * row - a cella sorindexe
    * col - a cella oszlopindexe
    * visszatérítési érték: 0 - a cella nem akna, 1 - a cella akna
*/
int Minefield::open_cell(int row, int col) {
    if (cells[row][col].is_flagged)
        return 0;
    
    if (cells[row][col].is_open)
        return open_neighbours(row, col);

    cells[row][col].is_open = true;

    if (cells[row][col].neighbours == 0)
        open_zeroes(row, col);

    return cells[row][col].is_mine;
}

/*
    * Beállítja a zászlót egy cellára. 
    * Ha a cella már be van jelölve, akkor a jelölést eltávolítja.
    * Ha a cella már nyitva van, akkor nem csinál semmit.
    * row - a cella sorindexe
    * col - a cella oszlopindexe
*/
void Minefield::flag_cell(int row, int col) {
    if (cells[row][col].is_open)
        return;

    cells[row][col].is_flagged = !cells[row][col].is_flagged;
}

/*
    * Ellenőrzi, hogy a keresett cella a pályán belül van-e.
    * row - a cella sorindexe
    * col - a cella oszlopindexe
    * visszatérítési érték: true - a cella a pályán belül van, false - a cella a pályán kívül van
*/
bool Minefield::check_bounds(int row, int col) {
    if (row < 0 || row >= board.get_rowsize() || col < 0 || col >= board.get_colsize())
        return false;

    return true;
}

/*
    * Kinyitja a 0 értékű szomszédos cellákat.
    * Rekurzív.
    * row - a cella sorindexe
    * col - a cella oszlopindexe
*/
void Minefield::open_zeroes(int row, int col) {
    for (int i = row - 1; i <= row + 1; i++)
        for (int j = col - 1; j <= col + 1; j++)
            if (check_bounds(i, j)) {
                if (!cells[i][j].is_open && !cells[i][j].is_flagged)
                    open_cell(i, j);
            }
}

/*
    * Kinyitja a szomszédos cellákat.
    * Ha a cella meg van jelölve, akkor azt nem nyitja ki.
    * row - a cella sorindexe
    * col - a cella oszlopindexe
    * visszatérítési érték: 1 - ha bármelyik szomszédos cella akna, 0 egyébként
*/
int Minefield::open_neighbours(int row, int col) {
    for (int i = row - 1; i <= row + 1; i++)
        for (int j = col - 1; j <= col + 1; j++)
            if (check_bounds(i, j))
                if (!cells[i][j].is_flagged && !cells[i][j].is_open) {
                    if (cells[i][j].is_mine)
                        return 1;

                    cells[i][j].is_open = true;

                    if (cells[i][j].neighbours == 0)
                        open_zeroes(i, j);
                }
                    

    return 0;
}

/*
    * Megnyitja az összes aknát.
*/
void Minefield::open_mines() {
    for (int i = 0; i < board.get_rowsize(); i++)
        for (int j = 0; j < board.get_colsize(); j++)
            if (cells[i][j].is_mine) {
                cells[i][j].is_open = true;
                cells[i][j].is_flagged = false;
            }
}

/*
    * Megnyitja az összes cellát.
*/
void Minefield::open_all() {
    for (int i = 0; i < board.get_rowsize(); i++)
        for (int j = 0; j < board.get_colsize(); j++) {
            cells[i][j].is_open = true;
            cells[i][j].is_flagged = false;
        }
}

/*
    * Ellenőrzi, hogy a játékos nyert-e.
    * visszatérítési érték: 1 - ha az összes cella nyitva van és egyik sem akna, 0 egyébként
*/
int Minefield::check_win() {
    for (int i = 0; i < board.get_rowsize(); i++)
        for (int j = 0; j < board.get_colsize(); j++)
            if (!cells[i][j].is_mine && !cells[i][j].is_open)
                return 0;

    return 1;
}

/*
    * Visszatéríti a cella szomszédos aknáinak számát.
    * Ha a cella akna, akkor -1-et térít vissza.
    * row - a cella sorindexe
    * col - a cella oszlopindexe
*/
int Minefield::neighbour_mines(int row, int col) {
    if (cells[row][col].is_mine)
        return -1;

    int count = 0;

    for (int i = row - 1; i <= row + 1; i++)
        for (int j = col - 1; j <= col + 1; j++)
            if (check_bounds(i, j))
                if (cells[i][j].is_mine)
                    count++;

    return count;
}