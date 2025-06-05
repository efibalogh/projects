/*
    * Ritka mátrix - függvények és osztályok definíciói
    * Balogh Efraim
    * 2023. 04. 09.
*/

#include <iostream>
#include <fstream>
#include <algorithm>
#include "sparse_matrix.h"

using namespace std;

/*
    * A konstruktorok.
*/
element::element() {
    row = -1;
    col = -1;
    val = 0;
}

element::element(int row, int col, int val) {
    if (row >= 50000 || col >= 50000 || row < 0 || col < 0)
        throw "Hiba: tulindexeles!\n";

    this->row = row;
    this->col = col;
    this->val = val;
}

sparse_matrix::sparse_matrix() {
    rowsize = 0;
    colsize = 0;
    nonzero = 0;
    data = NULL;
}

sparse_matrix::sparse_matrix(int rowsize, int colsize, int nonzero) {
    if (rowsize < 0 || colsize < 0)
        throw "Hiba: negativ meret!\n";
    
    if (rowsize >= 50000 || colsize >= 50000)
        throw "Hiba: tul nagy meret!\n";

    if (nonzero < 0 || nonzero > rowsize * colsize)
        throw "Hiba: negativ vagy tul nagy nem nulla elemek szama!\n";
    
    this->rowsize = rowsize;
    this->colsize = colsize;
    this->nonzero = nonzero;
    data = new element [nonzero];
}

sparse_matrix::~sparse_matrix() {
    data = NULL;
    delete [] data;
}

/*
    * Beállítja a mátrix egy elemét.
    * Ha a megadott elem már létezik, akkor felülírja az értékét.
    * Ha az érték 0, akkor törli az elemet.
    * Ha túllépi a kezdő értékkel megadott nem nulla elemek számát, akkor újra foglalja a memóriát.
    * row - a sor indexe
    * col - az oszlop indexe
    * val - az elem értéke
*/
void sparse_matrix::set_value(int row, int col, int val) {
    if (row < 0 || col < 0 || row >= rowsize || col >= colsize)
        throw "Hiba: tulindexeles!\n";

    if (val == 0) {
        delete_element(row, col);

        return;
    }

    if (count_nonzero() >= nonzero) {
        element *temp = new element [nonzero + 1];
        copy(data, data + nonzero, temp);
        delete [] data;
        data = temp;
        temp = NULL;
        delete [] temp;
        nonzero++;
    }

    for (int i = 0; i < nonzero; i++)
        if (data[i].row == row && data[i].col == col) {
            data[i].val = val;

            return;
        }

    for (int i = 0; i < nonzero; i++)
        if (data[i].row == -1 && data[i].col == -1) {
            data[i] = {row, col, val};

            return;
        }
}

/*
    * Visszatéríti a mátrix egy elemét.
    * Ha az elem nincs lementve a mátrixban, akkor 0-t ad vissza.
    * row - a sor indexe
    * col - az oszlop indexe
*/
int sparse_matrix::get_value(int row, int col) {
    if (row < 0 || col < 0 || row >= rowsize || col >= colsize)
        throw "Hiba: tulindexeles!\n";

    for (int i = 0; i < nonzero; i++)
        if (data[i].row == row && data[i].col == col)
            return data[i].val;

    return 0;
}

/*
    * Töröl egy elemet a mátrixból.
    * row - a sor indexe
    * col - az oszlop indexe
*/
void sparse_matrix::delete_element(int row, int col) {
    if (row >= rowsize || col >= colsize) {
        throw "Hiba: tulindexeles!\n";
        
        return;
    }

    if (count_nonzero() == 0) {
        throw "Hiba: nincs nem nulla elem!\n";
        
        return;
    }

    if (get_value(row, col) == 0)
        return;

    element *temp = new element [nonzero - 1];
    int j = 0;

    for (int i = 0; i < nonzero; i++)
        if (data[i].row != row || data[i].col != col) {
            temp[j] = data[i];
            j++;
        }

    delete [] data;
    data = temp;
    temp = NULL;
    delete [] temp;
    nonzero--;
}

/*
    * Vizsgálja, hogy egy adott elem létezik-e a mátrixban.
    * x - a keresett elem
    * igazat térít vissza, ha létezik, hamisat, ha nem.
*/
bool sparse_matrix::contains_value(int x) {
    for (int i = 0; i < rowsize; i++)
        for (int j = 0; j < colsize; j++)
            if (get_value(i, j) == x)
                return true;

    return false;
}

/*
    * Beolvassa a mátrixot a standard bemenetről.
*/
void sparse_matrix::read() {
    int **temp = new int *[rowsize];

    for (int i = 0; i < rowsize; i++)
        temp[i] = new int [colsize];

    for (int i = 0; i < rowsize; i++)
        for (int j = 0; j < colsize; j++) {
            cin >> temp[i][j];

            if (temp[i][j] != 0)
                set_value(i, j, temp[i][j]);
        }

    for (int i = 0; i < rowsize; i++)
        delete [] temp[i];

    temp = NULL;
    delete [] temp;
}

/*
    * Beolvassa a mátrixot egy fájlból.
    * filename - a fájl neve
*/
void sparse_matrix::readfile(const char *filename) {
    ifstream file(filename);

    if (!file.is_open())
        throw "Hiba: nem sikerult megnyitni a fajlt!\n";

    int **temp = new int *[rowsize];

    for (int i = 0; i < rowsize; i++)
        temp[i] = new int [colsize];

    for (int i = 0; i < rowsize; i++)
        for (int j = 0; j < colsize; j++) {
            file >> temp[i][j];

            if (temp[i][j] != 0)
                set_value(i, j, temp[i][j]);
        }

    for (int i = 0; i < rowsize; i++)
        delete [] temp[i];

    temp = NULL;
    delete [] temp;

    file.close();
}

/*
    * Kiírja a mátrixot a standard kimenetre.
*/
void sparse_matrix::print() {
    for (int i = 0; i < rowsize; i++) {
        for (int j = 0; j < colsize; j++)
            cout << get_value(i, j) << " ";

        cout << "\n";
    }
}

/*
    * Kiírja a mátrixot egy fájlba.
    * filename - a fájl neve
*/
void sparse_matrix::printfile(const char *filename) {
    ofstream file(filename);

    if (!file.is_open())
        throw "Hiba: nem sikerult megnyitni a fajlt!\n";

    for (int i = 0; i < rowsize; i++) {
        for (int j = 0; j < colsize; j++)
            file << get_value(i, j) << " ";

        file << "\n";
    }

    file.close();
}

/*
    * Kiírja a ritka mátrixot felépítő 3 tömb tartalmát.
*/
void sparse_matrix::print_data() {
    stable_sort(data, data + nonzero, [](element a, element b) { return a.row < b.row; });
    cout << "A ritka matrix tartalma:\n";
    cout << "sor:    [ ";
    
    for (int i = 0; i < nonzero; i++)
        if (data[i].row != -1)
            cout << data[i].row << " ";

    cout << "]\noszlop: [ ";

    for (int i = 0; i < nonzero; i++)
        if (data[i].col != -1)
            cout << data[i].col << " ";

    cout << "]\nertek:  [ ";

    for (int i = 0; i < nonzero; i++)
        if (data[i].val != 0)
            cout << data[i].val << " ";

    cout << "]\n";
}

/*
    * Bejárja a mátrixot soronként.
*/
void sparse_matrix::print_by_row() {
    cout << "A ritka matrix soronkenti bejarasa:\n";

    for (int i = 0; i < rowsize; i++) {
        cout << i << ". sor: ";

        for (int j = 0; j < nonzero; j++)
            if (data[j].row == i)
                cout << "(" << data[j].col << ", " << data[j].val << ") ";

        cout << "\n";
    }
}

/*
    * Bejárja a mátrixot oszloponként.
*/
void sparse_matrix::print_by_col() {
    cout << "A ritka matrix oszloponkenti bejarasa:\n";

    for (int i = 0; i < colsize; i++) {
        cout << i << ". oszlop: ";

        for (int j = 0; j < nonzero; j++)
            if (data[j].col == i)
                cout << "(" << data[j].row << ", " << data[j].val << ") ";

        cout << "\n";
    }
}

/*
    * Visszatéríti a mátrix sorainak számát.
*/
int sparse_matrix::get_rowsize() {
    return rowsize;
}

/*
    * Visszatéríti a mátrix oszlopainak számát.
*/
int sparse_matrix::get_colsize() {
    return colsize;
}

/*
    * Visszatéríti a nem nulla elemek számát.
*/
int sparse_matrix::get_nonzero() {
    return nonzero;
}

/*
    * Megszámolja a mátrixban található nem nulla elemek számát.
*/
int sparse_matrix::count_nonzero() {
    int count = 0;

    for (int i = 0; i < rowsize; i++)
        for (int j = 0; j < colsize; j++)
            if (get_value(i, j) != 0)
                count++;

    return count;
}

/*
    * Átmásolja az adott mátrixba a paraméterként kapott mátrix adatait.
*/
void sparse_matrix::copy_data(sparse_matrix &A) {
    nonzero = A.get_nonzero();
    data = new element [nonzero];

    for (int i = 0; i < nonzero; i++)
        data[i] = A.data[i];
}

/*
    * Összead az adott mátrixszal egy másik mátrixot.
    * A - a másik mátrix
*/
void sparse_matrix::add(sparse_matrix &A) {
    if (this->rowsize != A.get_rowsize() || this->colsize != A.get_colsize())
        throw "Hiba: a ket matrix nem osszeadhato, meretuk kulonbozik!\n";

    int i = 0, j = 0;

    while (i < this->nonzero || j < A.nonzero) {
        if (i < this->nonzero && (j >= A.nonzero || this->data[i].row < A.data[j].row || (this->data[i].row == A.data[j].row && this->data[i].col < A.data[j].col))) {
            i++;
        }
        else if (j < A.nonzero && (i >= this->nonzero || A.data[j].row < this->data[i].row || (A.data[j].row == this->data[i].row && A.data[j].col < this->data[i].col))) {
            set_value(A.data[j].row, A.data[j].col, A.data[j].val);
            j++;
        }
        else {
            int sum = this->data[i].val + A.data[j].val;
            
            if (sum != 0)
                set_value(this->data[i].row, this->data[i].col, sum);
            
            i++;
            j++;
        }
    }
}

/*
    * Kivon az adott mátrixból egy másik mátrixot.
    * A - a másik mátrix
*/
void sparse_matrix::subtract(sparse_matrix &A) {
    if (this->rowsize != A.get_rowsize() || this->colsize != A.get_colsize())
        throw "Hiba: a ket matrix nem kivonhato, meretuk kulonbozik!\n";

    int i = 0, j = 0;

    while (i < this->nonzero || j < A.get_nonzero()) {
        if (i < this->nonzero && (j >= A.get_nonzero() || this->data[i].row < A.data[j].row || (this->data[i].row == A.data[j].row && this->data[i].col < A.data[j].col))) {
            i++;
        }
        else if (j < A.get_nonzero() && (i >= this->nonzero || this->data[i].row > A.data[j].row || (this->data[i].row == A.data[j].row && this->data[i].col > A.data[j].col))) {
            set_value(A.data[j].row, A.data[j].col, -A.data[j].val);
            j++;
        }
        else {
            int diff = this->data[i].val - A.data[j].val;

            if (diff != 0)
                set_value(this->data[i].row, this->data[i].col, diff);

            i++;
            j++;
        }
    }
}

/*
    * Elvégzi a transzponálást a mátrixon.
*/
void sparse_matrix::transpose() {
    if (rowsize != colsize)
        throw "Hiba: a matrix nem transzponalhato, mert nem negyzetes!\n";
        
    int temp;

    for (int i = 0; i < nonzero; i++) {
        temp = data[i].row;
        data[i].row = data[i].col;
        data[i].col = temp;
    }
}