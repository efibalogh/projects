/*
    * Aknakereső - főprogram
    * Balogh Efraim
    * 2023. 04. 09.
*/

#include "minesweeper.h"

using namespace std;

bool ok_input(int rows, int cols, int diff) {
    if (rows < 8 || rows > 99 || cols < 8 || cols > 99 || diff < 1 || diff > 3)
        return false;

    return true;
}

void init_game(int &rows, int &cols, int &mines, int &diff) {
    do {
        cout << "===== Aknakereso =====\n\n";
        cout << "A palya merete 8x8 es 99x99 kozott valaszthato.\n";
        cout << "Add meg a palya meretet!\n";
        cout << "- sor: ";
        cin >> rows;
        cout << "- oszlop: ";
        cin >> cols;
        cout << "Valassz nehezseget:\n- 1: 5-15 bomba\n- 2: 15-30 bomba\n- 3: 30+ bomba\n";
        cin >> diff;

        if (!ok_input(rows, cols, diff)) {
            cout << "Hiba: rossz bemenet!\nProbald ujra!\n";
            sleep(2);
            clear();
        }
    } while (!ok_input(rows, cols, diff));

    if (diff == 1)
        mines = rand() % 6 + 10;
    else if (diff == 2)
        mines = rand() % 16 + 15;
    else if (diff == 3)
        mines = rand() % 30 + 30;
}

void start_game(Minefield &minefield, int &game_over, int &game_won) {
    do {
        cout << "===== Aknakereso =====\n\n";
        minefield.print();
        cout << "\n[x] [y] [o/f]: ";
        int x, y;
        char action;
        cin >> x >> y >> action;

        game_over = minefield.interact_with_cell(x, y, action);
        game_won = minefield.check_win();

        clear();

    } while (game_over == 0 && game_won == 0);
}

void end_game(Minefield &minefield, int &game_over, int &game_won, bool &again) {
    cout << "===== Aknakereso =====\n\n";
    
    if (game_over == 1) {
        minefield.open_all();
        minefield.print();
        cout << "\nVesztettel!\n";
    }
    else {
        minefield.open_all();
        minefield.print();
        cout << "\nNyertel!\n";
    }

    char answer;
    cout << "Ujra? (y/n): ";
    cin >> answer;

    if (answer == 'y' || answer == 'Y')
        again = true;
    else
        again = false;
}

int main() {
    init_rand();
    bool again;
    
    do {
        int rows, cols, mines;
        int diff;
        int game_over = 0, game_won = 0;

        init_game(rows, cols, mines, diff);

        Minefield minefield(rows, cols, mines);
        minefield.generate_field();
        clear();
        
        start_game(minefield, game_over, game_won);
        end_game(minefield, game_over, game_won, again);

        if (again)
            clear();
    } while (again);

    return 0;
}