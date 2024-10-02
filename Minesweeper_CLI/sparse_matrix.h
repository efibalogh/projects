/*
    * Ritka mátrix - függvények és osztályok deklarációi
    * Balogh Efraim
    * 2023. 04. 09.
*/

#ifndef __SPARSE_MATRIX_H__
#define __SPARSE_MATRIX_H__

class element {
public:
    int row;
    int col;
    int val;

    element();
    
    element(int, int, int);
};

class sparse_matrix {
    int rowsize;
    int colsize;
    int nonzero;
    element *data;

public:
    sparse_matrix();
    
    sparse_matrix(int, int, int);

    ~sparse_matrix();

    void set_value(int, int, int);

    int get_value(int, int);

    void delete_element(int, int);

    bool contains_value(int);

    void read();

    void readfile(const char *);

    void print();

    void printfile(const char *);

    void print_data();

    void print_by_row();

    void print_by_col();

    int get_rowsize();

    int get_colsize();

    int get_nonzero();

    int count_nonzero();

    void copy_data(sparse_matrix &);

    void add(sparse_matrix &);

    void subtract(sparse_matrix &);

    void transpose();
};

#endif